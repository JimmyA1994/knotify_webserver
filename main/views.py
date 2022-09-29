from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views import View
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from main.models import Result, Run, StatusChoices, UserProfile
from django.utils import timezone, dateformat
from guest_user.mixins import AllowGuestUserMixin
from guest_user.models import is_guest_user
import json

from celery import Celery
app = Celery("knotify", backend='redis://redis:6379',
                            broker='redis://redis:6379')
class HomePageView(AllowGuestUserMixin, LoginRequiredMixin,TemplateView):
    # supress passing next field in login redirect
    redirect_field_name=None
    template_name = 'home.html'

    def get(self, request):
        user = request.user
        current_runs_queryset = Run.objects.filter(user=user, status=StatusChoices.ONGOING).select_related('result__sequence').values_list('uuid', 'result__sequence', 'submitted')
        previous_runs_queryset = Run.objects.filter(user=user, status=StatusChoices.COMPLETED).select_related('result__sequence').values_list('uuid', 'result__sequence', 'result__structure', 'submitted', 'completed')
        date_format = lambda x : dateformat.format(x, 'Y-m-d H:i:s O e')
        previous_runs = [{'id':str(uuid), 'sequence': sequence, 'structure': structure ,'submitted': date_format(submitted), 'completed': date_format(completed)}
                         for uuid, sequence, structure, submitted, completed in previous_runs_queryset]
        previous_runs_ids = [str(run[0]) for run in previous_runs_queryset]
        try:
            latest_history_uuid = str(previous_runs_queryset.last()[0])
        except:
            latest_history_uuid = ''
        current_runs = [{'id': str(uuid), 'sequence': sequence, 'submitted': date_format(submitted)} for uuid, sequence, submitted in current_runs_queryset]
        context = { 'current_runs': current_runs, 'previous_runs': previous_runs, 'latest_history_uuid': latest_history_uuid, 'previous_runs_ids': previous_runs_ids}
        return render(request, self.template_name, context)

class ResultsView(LoginRequiredMixin, TemplateView):
    template_name = "results.html"

class LoginView(TemplateView):
    template_name = 'login.html'

@require_http_methods(['POST'])
def process_signup_view(request):
    body = json.loads(request.body.decode('UTF-8'))
    if not {'email', 'password'}.issubset(body.keys()):
        return HttpResponseBadRequest('No username or password was provided.')
    email = body.get('email', '')
    username = email.split('@')[0]
    password = body.get('password', '')
    user = User.objects.create_user(username=username, email=email, password=password)
    if user:
        if is_guest_user(request.user):
            # migrate Runs to new user
            Run.objects.filter(user=request.user).update(user=user)

            # migrate UserProfile to new user
            guest_user__user_profile_values = UserProfile.objects.filter(user=request.user).values().first()
            del guest_user__user_profile_values['id']
            del guest_user__user_profile_values['user_id']
            UserProfile.objects.filter(user=user).update(**guest_user__user_profile_values)
            User.objects.get(pk=request.user.id).delete() # delete guest user

            logout(request)
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return JsonResponse({'status':'good'})
    else:
        return JsonResponse({'status':'bad'})


@require_http_methods(['POST'])
def process_login_view(request):
    body = json.loads(request.body.decode('UTF-8'))
    email = body.get('email', '')
    username = email.split('@')[0]
    password = body.get('password', '')
    print(f'{email = }')
    print(f'{password = }')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return JsonResponse({'status':'good'})
    else:
        return JsonResponse({'status':'bad'})


@login_required(redirect_field_name=None)
@require_http_methods(['POST'])
def logout_view(request):
    try:
        logout(request)
    except:
        return JsonResponse({'status':'bad'})
    else:
        return JsonResponse({'status':'good'})


class ResultsView(LoginRequiredMixin, View):
    redirect_field_name = None

    def get_context_data(self, run):
        if not run:
            return
        with open('static/css/fornac_min.css') as f:
            lines = f.readlines()
        css = lines[0] # pass css to include in svg
        context = {
            'sequence': run.result.sequence, 'structure': run.result.structure, 'num_of_pseudoknots': run.result.structure.count('['),
            'uuid': run.uuid, 'css': css, 'pseudoknot_options': run.result.pseudoknot_options,
            'hairpin_options': run.result.hairpin_options, 'energy_options': run.result.energy_options
        }
        return context

    def get(self, request):
        """Return results page based on a previous run"""
        uuid = request.GET.get('uuid')
        run = Run.objects.get(uuid=uuid)
        context = self.get_context_data(run)
        return render(request, 'results.html', context)

    def post(self, request):
        """Return results page for a newly requested sequence"""
        try:
            sequence = request.POST['sequence'].upper()
        except:
            return HttpResponseBadRequest('sequence parameter was not received.')

        PSEUDOKNOT_OPTIONS_FIELDS = [
            'parser', 'allow_ug', 'allow_skip_final_au', 'max_dd_size',
            'min_dd_size', 'max_window_size', 'min_window_size',
            'max_window_size_ratio', 'min_window_size_ratio',
            'max_stem_allow_smaller', 'prune_early'
        ]
        pseudoknot_options = {key:request.POST[key] for key in PSEUDOKNOT_OPTIONS_FIELDS if key in request.POST}

        HAIRPIN_OPTIONS_FIELDS = [
            'hairpin_grammar', 'hairpin_allow_ug',
            'min_hairpin_size', 'min_hairpin_stems',
            'max_hairpins_per_loop', 'max_hairpin_bulge'
        ]
        hairpin_options = {key:request.POST[key] for key in HAIRPIN_OPTIONS_FIELDS if key in request.POST}
        # traslate hairpin_grammar checkbox to the corresponding library
        if 'hairpin_grammar' in hairpin_options:
            if hairpin_options['hairpin_grammar']:
                hairpin_options['hairpin_grammar'] = './libhairpin.so'
            else:
                del hairpin_options['hairpin_grammar']

        ENERGY_OPTIONS_FIELDS = ['energy']
        energy_options = {key:request.POST[key] for key in ENERGY_OPTIONS_FIELDS if key in request.POST}

        # initialize result and run on db, so that polling can check for process status
        initialized_result = Result.objects.create(sequence=sequence)
        submitted = timezone.now()
        user = request.user
        initialized_run = Run.objects.create(user=user, result=initialized_result, submitted=submitted)
        model_ids = {'result_id': initialized_result.id, 'run_id':initialized_run.uuid.hex}

        # send task to knotify service for processing
        app.send_task('predict', (sequence, pseudoknot_options, hairpin_options, energy_options, model_ids))

        return JsonResponse({'success': 'OK'})


@login_required(redirect_field_name=None)
@require_http_methods(['POST'])
def convert_svg_view(request):
    import base64
    try:
        body = json.loads(request.body.decode('UTF-8'))
        svg = body['svg']
        format = body['format']
    except:
        return HttpResponseBadRequest('Parameters are not recognisable. Make sure your content is json and includes the following two fields: svg, format')
    if format == 'png':
        from cairosvg import svg2png
        b64_binary = base64.b64encode(svg2png(svg))
    elif format == 'ps':
        from cairosvg import svg2ps
        b64_binary = base64.b64encode(svg2ps(svg))
    elif format == 'pdf':
        from cairosvg import svg2pdf
        b64_binary = base64.b64encode(svg2pdf(svg))
    else:
        return HttpResponseBadRequest('Format is not supported. Please select one of the following formats: png, ps, pdf.')
    return HttpResponse(b64_binary)

class InteractiveView(LoginRequiredMixin, View):
    redirect_field_name = None

    def post(self, request):
        data = request.POST
        sequence = data.get('sequence')
        structure = data.get('structure')
        with open('static/css/fornac_min.css') as f:
            lines = f.readlines()
        css = lines[0] # pass css to include in svg
        context = {'sequence': sequence, 'structure': structure, 'css': css}
        return render(request, 'interactive.html', context)


@login_required(redirect_field_name=None)
@require_http_methods(['POST'])
def update_history_view(request):
    '''
        Return json with newest current and previous runs.
        If latest_history_uuid is provided then all completed runs
        after the specified will be returned, else return all previous runs
    '''
    user = request.user
    data = json.loads(request.body.decode("utf-8"))
    latest_history_uuid = data.get('latest_history_uuid')
    current_runs_queryset = (Run.objects
                                .filter(user=user, status=StatusChoices.ONGOING)
                                .select_related('result__sequence')
                                .values_list('uuid', 'result__sequence', 'submitted'))
    previous_runs_queryset = (Run.objects
                                 .filter(user=user, status=StatusChoices.COMPLETED))
    if latest_history_uuid:
        last_previous_entry = Run.objects.get(pk=latest_history_uuid)
        completed = last_previous_entry.completed
        previous_runs_queryset = previous_runs_queryset.filter(completed__gt=completed)
    previous_runs_queryset = (previous_runs_queryset.select_related('result__sequence')
                                                    .values_list('uuid', 'result__sequence', 'result__structure', 'submitted', 'completed'))
    date_format = lambda x : dateformat.format(x, 'Y-m-d H:i:s O e')
    previous_runs = [{'id':str(uuid), 'sequence':sequence, 'structure': structure,'submitted':date_format(submitted), 'completed':date_format(completed)}
                     for uuid, sequence, structure, submitted, completed in previous_runs_queryset]
    current_runs = [{'id':str(run[0]), 'sequence':run[1], 'submitted':date_format(run[2])} for run in current_runs_queryset]
    try:
        latest_history_uuid = previous_runs[-1]['id']
    except:
        latest_history_uuid = ''

    context = { 'current_runs': current_runs, 'previous_runs': previous_runs, 'latest_history_uuid': latest_history_uuid}

    if is_guest_user(user):
        # add flag to trigger notification
        user = User.objects.select_related('userprofile').get(pk=user.id)
        if not user.userprofile.guest_notified_for_conversion and len(previous_runs) > 0:
            context['notify_guest_user'] = True
            user.userprofile.guest_notified_for_conversion = True
            user.userprofile.save()

    return JsonResponse(context)


@login_required(redirect_field_name=None)
@require_http_methods(['POST'])
def delete_run_view(request):
    body = json.loads(request.body.decode('UTF-8'))
    run_uuid = body.get('run_uuid', '')
    success = True
    try:
        run = Run.objects.get(pk=run_uuid)
        result = run.result
        result.delete() # cascade on delete removes run also
    except:
        success = False
    return JsonResponse({'success': success})


@csrf_exempt
@require_http_methods(['POST'])
def handle_task_completion(request):
    try:
        data = json.loads(request.body.decode())
    except Exception as e:
        # future mail here
        raise Exception(f'handle task completion failed retrieving json send by celery worker.')
    if not data.get('model_ids'):
        raise Exception(f'Task returned success=False')

    # retrieve unserializable objects
    model_ids = data.get('model_ids', {})
    run_id = model_ids.get('run_id', '')
    run = Run.objects.get(pk=run_id)
    result_id = model_ids.get('result_id', '')
    result = Result.objects.get(pk=result_id)

    if not data.get('success'):
        run.status = StatusChoices.FAILED
        run.save(update_fields=('status'))
        result.delete()
        raise Exception(f'Task returned success=False')

    # update result
    result.pseudoknot_options = data.get('validated_pseudoknot_options', {})
    result.hairpin_options = data.get('validated_hairpin_options', {})
    result.energy_options = data.get('validated_energy_options', {})
    result.structure = data.get('structure', '')
    result.save(update_fields=('pseudoknot_options', 'hairpin_options', 'energy_options', 'structure'))

    # update run
    completed = timezone.now()
    run.status = StatusChoices.COMPLETED
    run.completed = completed
    run.save(update_fields=('status', 'completed'))

    return HttpResponse()
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views import View
from .utils import KnotifyClient
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from main.models import Result, Run
from django.utils import timezone, dateformat
import json

class HomePageView(LoginRequiredMixin, TemplateView):
    # supress passing next field in login redirect
    redirect_field_name=None
    template_name = 'home.html'

    def get(self, request):
        user = request.user
        runs_queryset = Run.objects.filter(user=user).select_related('result__sequence').values_list('uuid', 'result__sequence', 'submitted', 'completed')
        date_format = lambda x : dateformat.format(x, 'Y-m-d H:i:s O e')
        previous_runs = [(str(run[0]), run[1], date_format(run[2]), date_format(run[3])) for run in runs_queryset]
        context = { 'previous_runs': previous_runs}
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
        login(request, user)
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

        try:
            client = KnotifyClient(pseudoknot_options, hairpin_options, energy_options, sequence)
            user = request.user
        except:
            return HttpResponseBadRequest('Prediction failed to run. Please try again.')

        submitted = timezone.now()
        structure = client.predict()
        completed = timezone.now()
        result = Result.objects.create(sequence=sequence, pseudoknot_options=client.validated_pseudoknot_options,
                                       hairpin_options=client.validated_hairpin_options, energy_options=client.validated_energy_options,
                                       structure=structure)

        run = Run.objects.create(user=user, result=result, submitted=submitted, completed=completed)
        context = self.get_context_data(run)

        return render(request, 'results.html', context)


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
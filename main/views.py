from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.views.generic import TemplateView
from .utils import KnotifyClient

# Create your views here.
class HomePageView(TemplateView):
    template_name = 'home.html'

class ResultsView(TemplateView):
    template_name = "results.html"

class LoginView(TemplateView):
    template_name = 'login.html'

def results_view(request):
    sequence = request.POST['sequence'].upper()
    client = KnotifyClient()
    answer = client.predict(sequence)
    num_of_pseudoknots = answer.count('[')
    import uuid
    id = uuid.uuid4()
    with open('static/css/fornac_min.css') as f:
        lines = f.readlines()
    css = lines[0]

    context = {'sequence': sequence, 'answer': answer, 'num_of_pseudoknots': num_of_pseudoknots, 'uuid': id.hex, 'css': css}
    return render(request, 'results.html', context)


@require_http_methods(['POST'])
def convert_svg_view(request):
    import base64
    import json
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
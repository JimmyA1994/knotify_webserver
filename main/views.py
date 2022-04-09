from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from .utils import KnotifyClient

# Create your views here.
class HomePageView(TemplateView):
    template_name = 'home.html'


class ResultsView(TemplateView):
    template_name = "results.html"


def results_view(request):
    sequence = request.POST['sequence'].upper()
    client = KnotifyClient()
    answer = client.predict(sequence)

    context = {'sequence': sequence, 'answer': answer}
    return render(request, 'results.html', context)

# serve css static file. Used only redirection
def css_redirect(request):
    test_file = open('static/css/fornac.css', 'r')
    response = HttpResponse(content=test_file)
    response['Content-Type'] = 'text/css'
    return response

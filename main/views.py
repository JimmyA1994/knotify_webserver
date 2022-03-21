from django.shortcuts import render
from django.views.generic import TemplateView
from .utils import KnotifyClient

# Create your views here.
class HomePageView(TemplateView):    
    template_name = 'home.html'


class ResultsView(TemplateView):
    template_name = "results.html"


def results_view(request):
    sequence = request.POST['sequence']
    client = KnotifyClient()
    answer = client.predict(sequence)

    context = {'sequence': sequence, 'answer': answer}
    return render(request, 'results.html', context)
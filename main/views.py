from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
import requests, json

# Create your views here.
class HomePageView(TemplateView):    
    template_name = 'home.html'


class ResultsView(TemplateView):
    template_name = "results.html"


def results_view(request):
    sequence = request.POST['sequence']
    print(sequence)
    x = requests.get('http://10.249.231.107:12345/sequence=' + sequence)
    d = json.loads(x.text)
    answer = d.get('answer', '')
    print(f'{answer = }')

    context = {'sequence': sequence, 'answer': answer}
    return render(request, 'results.html', context)
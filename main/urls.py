from django.urls import path
from .views import HomePageView, ResultsView, results_view, css_redirect

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    # path('results/', ResultsView.as_view(), name='results'),
    # fornac asks corresponding css in results directory, instead of static
    path(r'results/css/fornac.css', css_redirect),
    path('results/', results_view, name='results'),
]

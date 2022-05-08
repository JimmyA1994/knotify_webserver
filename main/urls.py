from django.urls import path
from .views import HomePageView, ResultsView, results_view, convert_svg_view

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    # path('results/', ResultsView.as_view(), name='results'),
    path('results/', results_view, name='results'),
    path('results/convert_svg', convert_svg_view, name='convert_svg'),
]

from django.urls import path
from .views import HomePageView, LoginView, ResultsView, convert_svg_view, process_signup_view, process_login_view, logout_view

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/signup/', process_signup_view, name='process_signup'),
    path('login/login/', process_login_view, name='process_login'),
    path('logout/', logout_view, name='logout'),
    path('results/', ResultsView.as_view(), name='results'),
    path('results/convert_svg', convert_svg_view, name='convert_svg'),
]

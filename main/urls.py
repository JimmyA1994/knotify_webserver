from django.urls import path
from main import views

urlpatterns = [
    path('', views.HomePageView.as_view(), name='home'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('results/', views.ResultsView.as_view(), name='results'),
    path('team/', views.TeamPageView.as_view(), name='team'),
    path('research/', views.ResearchPageView.as_view(), name='research'),
    path('convert_svg', views.convert_svg_view, name='convert_svg'),
    path('interactive/', views.InteractiveView.as_view(), name='interactive'),
    path('update_history/', views.update_history_view, name='update_history'),
    path('delete_run/', views.delete_run_view, name='delete_run'),
    path('handle_task_completion/', views.handle_task_completion, name='handle_task_completion'),
    path('get_varna_arc_diagram/', views.get_varna_arc_diagram, name='get_varna_arc_diagram'),
]

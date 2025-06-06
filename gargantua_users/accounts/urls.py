from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', views.user_list, name='user_list'),
    path('create/', views.create_user, name='create_user'),
    path('toggle/<str:username>/', views.toggle_user_active, name='toggle_user_active'),
    path('password-change/', views.password_change, name='password_change'),
]

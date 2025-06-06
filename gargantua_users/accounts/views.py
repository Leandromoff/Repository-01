from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView
from django.views.generic.edit import FormView

from .forms import LoginForm, UserCreateForm, PasswordChangeForm
from .utils import load_users, save_users
from .user import SimpleUser


def admin_required(view):
    return user_passes_test(lambda u: getattr(u, 'is_admin_site', False))(view)


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            login(request, form.user, backend='accounts.auth_backend.FileAuthBackend')
            return redirect('user_list')
    else:
        form = LoginForm()
    return render(request, 'registration/login.html', {'form': form})


@login_required
@admin_required
def user_list(request):
    users = load_users()
    return render(request, 'accounts/user_list.html', {'users': users})


@login_required
@admin_required
def create_user(request):
    if request.method == 'POST':
        form = UserCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('user_list')
    else:
        form = UserCreateForm()
    return render(request, 'accounts/create_user.html', {'form': form})


@login_required
def toggle_user_active(request, username):
    users = load_users()
    data = users.get(username)
    if data and request.user.is_admin_site:
        data['is_active'] = not data.get('is_active', True)
        save_users(users)
    return redirect('user_list')


@login_required
def password_change(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            return redirect('user_list')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'accounts/change_password.html', {'form': form})

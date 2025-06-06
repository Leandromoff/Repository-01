from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from .utils import load_users, save_users

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned = super().clean()
        username = cleaned.get('username')
        password = cleaned.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise forms.ValidationError('Invalid credentials')
        self.user = user
        return cleaned

class UserCreateForm(forms.Form):
    username = forms.CharField()
    email = forms.EmailField()
    is_admin_site = forms.BooleanField(required=False)

    def save(self):
        users = load_users()
        username = self.cleaned_data['username']
        if username in users:
            raise forms.ValidationError('User already exists')
        email = self.cleaned_data['email']
        is_admin_site = self.cleaned_data['is_admin_site']
        password = get_random_string(12)
        hashed = make_password(password)
        users[username] = {
            'password': hashed,
            'email': email,
            'is_admin_site': is_admin_site,
            'is_active': True,
            'created_at': '',
            'roles': [],
        }
        save_users(users)
        send_mail(
            'Your account',
            f'Your password is: {password}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True,
        )
        return username

class PasswordChangeForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput)
    new_password1 = forms.CharField(widget=forms.PasswordInput)
    new_password2 = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_old_password(self):
        old = self.cleaned_data['old_password']
        users = load_users()
        data = users.get(self.user.username)
        if data and check_password(old, data['password']):
            return old
        raise forms.ValidationError('Incorrect password')

    def clean(self):
        cleaned = super().clean()
        pw1 = cleaned.get('new_password1')
        pw2 = cleaned.get('new_password2')
        if pw1 and pw2 and pw1 != pw2:
            raise forms.ValidationError('Passwords do not match')
        validate_password(pw1, user=None)
        return cleaned

    def save(self):
        users = load_users()
        data = users.get(self.user.username)
        data['password'] = make_password(self.cleaned_data['new_password1'])
        save_users(users)

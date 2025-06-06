from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .utils import load_users
from .user import SimpleUser

class FileAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        users = load_users()
        data = users.get(username)
        if not data or not data.get('is_active'):
            return None
        if check_password(password, data['password']):
            user = SimpleUser(username, data['email'], data.get('is_admin_site', False), data.get('is_active', True), data.get('roles', []))
            return user
        return None

    def get_user(self, user_id):
        users = load_users()
        data = users.get(user_id)
        if not data:
            return None
        return SimpleUser(user_id, data['email'], data.get('is_admin_site', False), data.get('is_active', True), data.get('roles', []))

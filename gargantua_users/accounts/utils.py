import json
import os
from django.conf import settings

USERS_FILE = os.path.join(settings.BASE_DIR, 'users.json')


def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, 'r') as f:
        return json.load(f)


def save_users(data):
    with open(USERS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

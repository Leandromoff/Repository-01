class SimpleUser:
    def __init__(self, username, email, is_admin_site=False, is_active=True, roles=None):
        self.username = username
        self.email = email
        self.is_admin_site = is_admin_site
        self.is_active = is_active
        self.roles = roles or []
        self.is_staff = is_admin_site
        self.is_superuser = is_admin_site

    def get_username(self):
        return self.username

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username

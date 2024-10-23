from django.db import models
from authtools.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password
# Create your models here.

class Client(models.Model):
    first_name = models.CharField(_('first name'), max_length=255)
    last_name = models.CharField(_('last name'), max_length=255)
    email = models.EmailField(_('email address'), max_length=255, unique=True, primary_key=True)
    password = models.CharField(_("password"), max_length=128)
    is_active = models.BooleanField(_("is active"))
    address = models.CharField(_("home address"), max_length=255)
    phone = models.CharField(_("phone number"), max_length=255)
    
    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super(Client, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
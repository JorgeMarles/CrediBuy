from django import forms

from .models import Client


class ClientForm(forms.ModelForm):
    class Meta:
        model=Client
        fields=("id", "email", "first_name", "last_name", "address", "phone", "is_active")

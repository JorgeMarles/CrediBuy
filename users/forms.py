from django import forms

from .models import Client


class ClientForm(forms.ModelForm):
    password=forms.CharField(widget=forms.PasswordInput())
    confirm_password=forms.CharField(widget=forms.PasswordInput())
    class Meta:
        model=Client
        fields=("email", "password", "first_name", "last_name", "address", "phone", "is_active")

    def clean(self):
        cleaned_data = super(ClientForm, self).clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            raise forms.ValidationError(
                "password and confirm_password does not match"
            )

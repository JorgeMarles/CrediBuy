from django.contrib import admin

from .models import Client
from .forms import ClientForm

# Register your models here.
class ClientAdmin(admin.ModelAdmin):
    model = Client
    form = ClientForm
    add_form = ClientForm
    list_display = ("email", "first_name", "last_name", "address")
    list_filter = ("email", "first_name", "last_name", "address")
    fieldsets = (
        (None, {"fields": ("email", "password", "confirm_password", "first_name", "last_name", "address", "phone", "is_active")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password", "confirm_password", "first_name", "last_name", "address", "phone", "is_active")}
        ),
    )
    search_fields = ("email", "first_name", "last_name", "address")
    ordering = ("email", )


admin.site.register(Client, ClientAdmin)
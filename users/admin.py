from django.contrib import admin

from .models import Client
from .forms import ClientForm

# Register your models here.
class ClientAdmin(admin.ModelAdmin):
    model = Client
    form = ClientForm
    add_form = ClientForm
    list_display = ("id", "email", "first_name", "last_name", "address")
    list_filter = ("id", "email", "first_name", "last_name", "address")
    fieldsets = (
        (None, {"fields": ("email", "first_name", "last_name", "address", "phone", "is_active")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "address", "phone", "is_active")}
        ),
    )
    search_fields = ("id", "email", "first_name", "last_name", "address")
    ordering = ("id", "email", )


admin.site.register(Client, ClientAdmin)
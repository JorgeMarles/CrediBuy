from django.contrib import admin

from .models import ProductType, Client

# Register your models here.
@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'status']
    search_fields = ['name']

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'address', 'phone']
    search_fields = ['first_name', 'last_name', 'email']
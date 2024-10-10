from django.contrib import admin

from .models import (
    ProductType,
    Product,
)


# Register your models here.
@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "status"]
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "price", "description", "stock"]
    search_fields = ["name", "description"]

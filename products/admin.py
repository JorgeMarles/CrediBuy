from django.contrib import admin

from .models import ProductType, Client, Employee, Administrator, Product, Credit, Payment

# Register your models here.
@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'status']
    search_fields = ['name']

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'address', 'phone']
    search_fields = ['first_name', 'last_name', 'email']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'role']
    search_fields = ['first_name', 'last_name', 'email', 'role']

@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email']
    search_fields = ['first_name', 'last_name', 'email']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'description', 'stock']
    search_fields = ['name', 'description']

@admin.register(Credit)
class CreditAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_client', 'get_product', 'created_at', 'status', 'debt', 'total_payments']
    search_fields = ['get_client', 'get_product', 'status']
    list_select_related = ['product', 'client']

    @admin.display(description="Client")
    def get_client(self, obj: Credit) -> str:
        return obj.client.__str__()
    
    @admin.display(description="Product")
    def get_product(self, obj: Credit) -> str:
        return obj.product.__str__()

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_client', 'get_product', 'value', 'due_to', 'status', 'value_delayed']
    search_fields = ['get_client', 'get_product', 'status']
    list_select_related = ['credit']

    @admin.display(description="Client")
    def get_client(self, obj: Payment) -> str:
        return obj.credit.client.__str__()
    
    @admin.display(description="Product")
    def get_product(self, obj: Payment) -> str:
        return obj.credit.product.__str__()

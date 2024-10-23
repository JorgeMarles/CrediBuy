from django.contrib import admin

from .models import Credit, Payment

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

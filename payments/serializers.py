from rest_framework import serializers
from .models import Credit, Payment
from .utils import get_payment_values, add_to_month
from products.models import Product
from datetime import datetime
from decimal import Decimal

class CreditCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = (
            "id",
            "client",
            "product",
            "created_at",
            "status",
            "debt",
            "total_payments",
        )
        extra_kwargs = {"debt": {"read_only": True}, "created_at": {"read_only": True}, "status":{"read_only":True}}

    def create(self, validated_data):
        product: Product = validated_data["product"]

        if product.stock <= 0:
            raise serializers.ValidationError("No products in stock")
        product.stock -= 1
        product.save()
        price = validated_data["product"].price
        n_payments = validated_data["total_payments"]
        payment_value, delayed_value = get_payment_values(price, n_payments)
        total_debt = payment_value * n_payments
        validated_data["debt"] = total_debt
        validated_data["status"] = "active"
        credit: Credit = super().create(validated_data)

        today = datetime.now()
        for i in range(1, n_payments + 1):
            due_to = add_to_month(today, i)
            Payment.objects.create(
                credit=credit,
                value=payment_value,
                due_to=due_to,
                paid=False,
                value_delayed=delayed_value,
            )
        return credit


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "value", "due_to", "value_delayed", "status", "credit", "paid")

    def update(self, instance: Payment, validated_data):
        credit = instance.credit
        if validated_data["paid"]:
            if not instance.paid:
                credit.debt -= instance.value
                if credit.debt < Decimal('0.00001') :
                    credit.debt = Decimal('0')
                    credit.status = 'completed'
        else:
            if instance.paid:
                if credit.status == 'completed':
                    credit.status = 'active'
                credit.debt += instance.value
        #don't update anything besides status
        validated_data['credit'] = instance.credit
        validated_data['due_to'] = instance.due_to
        validated_data['value'] = instance.value
        validated_data['value_delayed'] = instance.value_delayed
        credit.save()
        return super().update(instance, validated_data)


class CreditSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    product_name = serializers.SlugRelatedField(
        source="product", read_only=True, slug_field="name"
    )

    class Meta:
        model = Credit
        fields = (
            "id",
            "client",
            "client_name",
            "product",
            "product_name",
            "created_at",
            "status",
            "debt",
            "total_payments",
        )

    def get_client_name(self, obj):
        return obj.client.__str__()

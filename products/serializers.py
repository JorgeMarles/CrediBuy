from rest_framework import serializers
from .models import ProductType, Product

class ProductTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProductType
        fields = (
            "id",
            "name",
            "status"
        )

class ProductSerializer(serializers.ModelSerializer):
    product_type_name = serializers.SlugRelatedField(source = "product_type", read_only = True, slug_field = "name")
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "stock",
            "product_type",
            "product_type_name"
        )
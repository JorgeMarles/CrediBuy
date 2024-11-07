from rest_framework.filters import OrderingFilter

# Create your views here.
from .models import ProductType, Product
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ProductTypeSerializer, ProductSerializer

class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    ordering_fields = ['name']
    ordering = ['status','name']
    search_fields = ['name', 'status']
    filterset_fields = ['name', 'status']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    ordering_fields = ['name']
    ordering = ['name', 'price', 'product_type__name']
    search_fields = ['name', 'product_type__name']
    filterset_fields = ['name', 'price', 'product_type__name']


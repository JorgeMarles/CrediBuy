from rest_framework.filters import OrderingFilter
from .models import Client
from .serializers import ClientSerializer
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    ordering_fields = ['first_name', 'last_name', 'phone']
    ordering = ['first_name', 'last_name']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    filterset_fields = ['last_name', 'is_active']

from rest_framework import viewsets
from rest_framework import generics
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Credit, Payment
from .serializers import CreditCreationSerializer, CreditSerializer, PaymentSerializer
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
# Create your views here.
class CreditCreationView(generics.CreateAPIView):
    queryset = Credit.objects.all()
    serializer_class = CreditCreationSerializer

class CreditViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Credit.objects.all()
    serializer_class = CreditSerializer
    filter_backends = [OrderingFilter, DjangoFilterBackend, SearchFilter]
    search_fields = ["client__first_name", "client__last_name", "client__email", "status"]
    filterset_fields = ["client__first_name", "client__last_name", "client__email", "status"]
    ordering_fields = ["id", "created_at", "debt"]
    ordering = ['debt', "created_at"]

class PaymentViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    @action(detail=False, methods=['get'], url_path='by-credit/(?P<credit_id>[^/.]+)') 
    def by_credit(self, request, credit_id=None): 
        payments = self.queryset.filter(credit_id=credit_id) 
        serializer = self.get_serializer(payments, many=True) 
        return Response(serializer.data)

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from users.models import Client
from products.models import Product, ProductType
from .serializers import CreditCreationSerializer
from .models import Payment, Credit

# Create your tests here.
class CreditAndPaymentTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User = get_user_model()
        cls.user = User.objects.create_user(
            email="jamarlesf@gmail.com", password="12345"
        )
        cls.user.user_permissions.add(*Permission.objects.all())
        cls.client_data = Client.objects.create(
            email="client@example.com",
            first_name="Test",
            last_name="Client",
            is_active=True,
            address="123 Calle1",
            phone="3219876540",
        )
        cls.product_type = ProductType.objects.create(
            name="Test ProductType", status="active"
        )
        cls.product = Product.objects.create(
            name="Test Product",
            product_type=cls.product_type,
            price=12000000,
            description="test ini",
            stock=50,
        )
        credit_data = {
            "client": cls.client_data.id,
            "product": cls.product.id,
            "status": "started",
            "total_payments": 12,
        }
        serializer = CreditCreationSerializer(data=credit_data)
        serializer.is_valid(raise_exception=True)
        cls.credit = serializer.save()

    @classmethod
    def tearDownClass(cls):
        User = get_user_model()
        User.objects.all().delete()
        ProductType.objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_create_credit(self):
        url = reverse("credit-create")
        credit = {
            "client": self.client_data.id,
            "product": self.product.id,
            "status": "started",
            "total_payments": 12,
        }
        response = self.client.post(url, credit, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Product.objects.get(pk=self.product.id).stock, 48)

    def test_get_credit(self):
        url = reverse("credits-detail", kwargs={"pk": self.credit.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("total_payments"), 12)

    def test_list_credit(self):
        url = reverse("credits-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get("results")), 1)

    def test_search_credits(self):
        url = reverse("credits-list")
        response = self.client.get(url, {"search": "noexiste"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get("results")), 0)

    def test_get_payment_plan(self):
        url = reverse("payment-by-credit", kwargs={"credit_id": self.credit.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 12)
    
    def test_mark_payment(self):
        payments = Payment.objects.filter(credit=self.credit)
        payment = payments.first()
        credit_value = self.credit.debt
        payment_value = payment.value
        url = reverse("payment-detail", kwargs={'pk': payment.id})
        data = {
            "status": "completed"
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        new_credit = Credit.objects.get(id=self.credit.id)
        self.assertAlmostEqual(new_credit.debt, credit_value-payment_value, 4)
    
    def test_pay_all_debt(self):
        payments = Payment.objects.filter(credit=self.credit)
        for payment in payments:
            url = reverse("payment-detail", kwargs={'pk': payment.id})
            data = {
                "status": "completed"
            }
            response = self.client.patch(url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
       
        new_credit = Credit.objects.get(id=self.credit.id)
        self.assertEqual(new_credit.status, 'completed')


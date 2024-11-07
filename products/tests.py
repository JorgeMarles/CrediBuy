from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from .models import Product, ProductType
from decimal import Decimal

class ProductTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User = get_user_model()
        cls.user = User.objects.create_user(email="jamarlesf@gmail.com", password='12345')
        cls.user.user_permissions.add(*Permission.objects.all())
        cls.product_type = ProductType.objects.create(name='Test ProductType', status="active")
        cls.product = Product.objects.create(name='Test Product', product_type=cls.product_type, price=55000.83, description="test ini", stock=50)

    @classmethod
    def tearDownClass(cls):
        User = get_user_model()
        User.objects.all().delete()
        Product.objects.all().delete()
        ProductType.objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    
    
    def test_get_product_detail(self):
        url = reverse('product-detail', kwargs={"pk":self.product.id}) 
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("name"), self.product.name)

    def test_update_product(self):
        url = reverse('product-detail', kwargs={"pk":self.product.id})
        product = {
            "price": Decimal('5700.00')
        }
        response = self.client.patch(url, product, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get("price")), product["price"])

    def test_update_full_product(self):
        url = reverse('product-detail', kwargs={"pk":self.product.id})
        product = {
            "name": "Product test 2",
            "price": 50000,
            "product_type": ProductType.objects.first().id,
            "description": "test desc upd",
            "stock": 345
        }
        response = self.client.put(url, product, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("description"), product["description"])

    def test_delete_product(self):
        url = reverse('product-detail', kwargs={"pk":self.product.id})
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_get_product_list(self):
        url = reverse('product-list') 
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results')), 1)

    def test_create_product_ok(self):
        url = reverse('product-list')
        product = {
            "name": "Product test 2",
            "price": 50000,
            "product_type": self.product_type.id,
            "description": "test desc 1 ok",
            "stock": 345
        }
        response = self.client.post(url, product, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_product_bad_request(self):
        url = reverse('product-list')
        product = {
            "name": "Product test 2",
            "price": -50000,
            "product_type": ProductType.objects.first().id,
            "description": "test desc 1 bad",
            "stock": -34
        }
        response = self.client.post(url, product, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_product_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse('product-list')
        product = {
            "name": "Product test 2",
            "price": 50000,
            "product_type": ProductType.objects.first().id,
            "description": "test desc 1 unauth",
            "stock": 34
        }
        response = self.client.post(url, product, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProductTypeTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User = get_user_model()
        cls.user = User.objects.create_user(email="jamarlesf@gmail.com", password='12345')
        cls.user.user_permissions.add(*Permission.objects.all())
        cls.product_type = ProductType.objects.create(name='Test ProductType', status="active")

    @classmethod
    def tearDownClass(cls):
        User = get_user_model()
        User.objects.all().delete()
        ProductType.objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_get_product_type_detail(self):
        url = reverse('producttype-detail', kwargs={"pk":self.product_type.id}) 
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("name"), self.product_type.name)

    def test_update_product_type(self):
        url = reverse('producttype-detail', kwargs={"pk":self.product_type.id})
        product_type = {
            "status": 'inactive'
        }
        response = self.client.patch(url, product_type, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("status"), product_type["status"])

    def test_update_full_product_type(self):
        url = reverse('producttype-detail', kwargs={"pk":self.product_type.id})
        product_type = {
            "name": "ProductType test 2",
            "status": "inactive"
        }
        response = self.client.put(url, product_type, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("status"), product_type["status"])

    def test_delete_product_type(self):
        url = reverse('producttype-detail', kwargs={"pk":self.product_type.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_get_product_type_list(self):
        url = reverse('producttype-list') 
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results')), 1)

    def test_create_product_type_ok(self):
        url = reverse('producttype-list')
        product_type = {
            "name": "ProductType test 2",
            "status": "active"
        }
        response = self.client.post(url, product_type, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_product_type_bad_request(self):
        url = reverse('producttype-list')
        product_type = {
            "name": "ProductType test 2",
            "status": "invalid_status" 
        }
        response = self.client.post(url, product_type, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

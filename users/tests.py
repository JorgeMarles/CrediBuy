from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Client

class ClientTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        User = get_user_model()
        cls.user = User.objects.create_user(email="admin@example.com", password="12345")
        cls.user.user_permissions.add(*Permission.objects.all())
        cls.client_data = Client.objects.create(
            email="client@example.com",
            first_name="Test",
            last_name="Client",
            is_active=True,
            address="123 Calle1",
            phone="3219876540",
        )

    @classmethod
    def tearDownClass(cls):
        User = get_user_model()
        User.objects.all().delete()
        Client.objects.all().delete()
        super().tearDownClass()

    def setUp(self):
        self.client.force_authenticate(user=self.user)

    def test_get_client_detail(self):
        url = reverse("client-detail", kwargs={"pk": self.client_data.id})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("first_name"), self.client_data.first_name)

    def test_update_client(self):
        url = reverse("client-detail", kwargs={"pk": self.client_data.id})
        client_data = {"first_name": "Name22222"}
        response = self.client.patch(url, client_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("first_name"), client_data["first_name"])

    def test_update_full_client(self):
        url = reverse("client-detail", kwargs={"pk": self.client_data.id})
        client_data = {
            "first_name": "New Name",
            "last_name": "New lastname",
            "email": "client22222@example.com",
            "is_active": True,
            "address": "New street 111111",
            "phone": "3333333333",
        }

        response = self.client.put(url, client_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("address"), client_data["address"])

    def test_delete_client(self):
        url = reverse("client-detail", kwargs={"pk": self.client_data.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_client_list(self):
        url = reverse("client-list")
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get("results")), 1)

    def test_create_client_ok(self):
        url = reverse("client-list")
        client_data = {
            "first_name": "Ok",
            "last_name": "Client OK",
            "email": "foo@example.com",
            "is_active": True,
            "address": "codeforces",
            "phone": "91919191",
        }
        response = self.client.post(url, client_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_client_bad_request(self):
        url = reverse("client-list")
        client_data = {
            "first_name": "Err",
            "last_name": "LastErr",
            "email": self.client_data.email,  # Email duplicado
            "is_active": True,
            "address": "Errrrrr",
            "phone": "99999999",
        }
        response = self.client.post(url, client_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_client_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse("client-list")
        client_data = {
            "first_name": "Carlos",
            "last_name": "Salazar",
            "email": "carlos48@codeforces.com",
            "is_active": True,
            "address": "candidate master",
            "phone": "9124834734",
        }
        response = self.client.post(url, client_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
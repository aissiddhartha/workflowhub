from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import WorkflowItem


class RegistrationTests(APITestCase):
    def test_weak_password_is_rejected(self):
        response = self.client.post(
            "/api/auth/register/",
            {"username": "sid", "email": "sid@example.com", "password": "weak"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertFalse(User.objects.filter(username="sid").exists())

    def test_strong_password_registers_and_returns_token(self):
        response = self.client.post(
            "/api/auth/register/",
            {"username": "sid", "email": "sid@example.com", "password": "Strong@123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)


class ItemOwnershipTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user("owner", "owner@example.com", "Strong@123")
        self.other = User.objects.create_user("other", "other@example.com", "Strong@123")
        self.item = WorkflowItem.objects.create(owner=self.owner, title="Private task")

    def test_user_only_sees_their_own_items(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get("/api/workflow-items/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_user_cannot_open_another_users_item(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get(f"/api/workflow-items/{self.item.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DemoFailureTests(APITestCase):
    def test_demo_failure(self):
        self.assertEqual(1, 2)
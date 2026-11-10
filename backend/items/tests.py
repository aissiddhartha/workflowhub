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


class ItemApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("sid", "sid@yopmail.com", "Siddhartha@123")
        self.other = User.objects.create_user("other", "other@yopmail.com", "Other@123")
        self.client.force_authenticate(user=self.user)

    def make_item(self, owner=None, **kwargs):
        return WorkflowItem.objects.create(owner=owner or self.user, title="Task", **kwargs)

    def test_create_item_uses_defaults_and_sets_owner(self):
        response = self.client.post(
            "/api/workflow-items/", {"title": "Write tests"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "Backlog")
        self.assertEqual(response.data["priority"], "Medium")
        item = WorkflowItem.objects.get(id=response.data["id"])
        self.assertEqual(item.owner, self.user)

    def test_title_is_required(self):
        response = self.client.post(
            "/api/workflow-items/", {"description": "no title"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_move_item_to_another_status(self):
        item = self.make_item()
        response = self.client.patch(
            f"/api/workflow-items/{item.id}/", {"status": "In Progress"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.status, "In Progress")

    def test_invalid_status_is_rejected(self):
        item = self.make_item()
        response = self.client.patch(
            f"/api/workflow-items/{item.id}/", {"status": "Nonsense"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        item.refresh_from_db()
        self.assertEqual(item.status, "Backlog")

    def test_change_item_priority(self):
        item = self.make_item()
        response = self.client.patch(
            f"/api/workflow-items/{item.id}/", {"priority": "Urgent"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.priority, "Urgent")

    def test_delete_item(self):
        item = self.make_item()
        response = self.client.delete(f"/api/workflow-items/{item.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(WorkflowItem.objects.filter(id=item.id).exists())

    def test_items_require_login(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/workflow-items/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_update_another_users_item(self):
        item = self.make_item(owner=self.other)
        response = self.client.patch(
            f"/api/workflow-items/{item.id}/", {"title": "Hacked"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        item.refresh_from_db()
        self.assertEqual(item.title, "Task")

    def test_user_cannot_delete_another_users_item(self):
        item = self.make_item(owner=self.other)
        response = self.client.delete(f"/api/workflow-items/{item.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(WorkflowItem.objects.filter(id=item.id).exists())
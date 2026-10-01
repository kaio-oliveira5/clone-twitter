from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class PostTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="TestPassword123",
        )

        self.client.force_authenticate(user=self.user)

    def test_create_post(self):
        response = self.client.post(
            "/api/posts/",
            {"content": "Meu primeiro post de teste!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], "testuser")
        self.assertEqual(
            response.data["content"],
            "Meu primeiro post de teste!",
        )

    def test_list_posts(self):
        self.client.post(
            "/api/posts/",
            {"content": "Post de teste"},
            format="json",
        )

        response = self.client.get("/api/posts/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["content"],
            "Post de teste",
        )

    def test_create_post_without_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            "/api/posts/",
            {"content": "Post sem autenticação"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_content_max_length(self):
        content = "a" * 281

        response = self.client.post(
            "/api/posts/",
            {"content": content},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
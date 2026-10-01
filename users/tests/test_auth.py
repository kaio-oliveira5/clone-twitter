from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationTests(APITestCase):

    def setUp(self):
        self.user_data = {
            "username": "test_user",
            "email": "test@example.com",
            "name": "Test User",
            "password": "Test@123456",
        }

        self.user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            name=self.user_data["name"],
            password=self.user_data["password"],
        )

    def test_register_user(self):
        data = {
            "username": "new_user",
            "email": "new@example.com",
            "name": "New User",
            "password": "NewUser@123456",
        }

        response = self.client.post(
            "/api/auth/register/",
            data,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(username="new_user").exists()
        )

    def test_login_user(self):
        data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }

        response = self.client.post(
            "/api/auth/login/",
            data,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_me_requires_authentication(self):
        response = self.client.get("/api/auth/me/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_me_authenticated(self):
        login_response = self.client.post(
            "/api/auth/login/",
            {
                "username": self.user_data["username"],
                "password": self.user_data["password"],
            },
        )

        access_token = login_response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["username"],
            self.user_data["username"],
        )

    def test_change_password(self):
        login_response = self.client.post(
            "/api/auth/login/",
            {
                "username": self.user_data["username"],
                "password": self.user_data["password"],
            },
        )

        access_token = login_response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.patch(
            "/api/auth/password/",
            {
                "old_password": self.user_data["password"],
                "new_password": "NewPassword@123",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password("NewPassword@123")
        )
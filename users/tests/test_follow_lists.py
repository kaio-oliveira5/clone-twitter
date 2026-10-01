from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Follow


User = get_user_model()


class FollowListsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="usuario1",
            email="usuario1@example.com",
            password="TestPassword123",
        )

        self.other_user = User.objects.create_user(
            username="usuario2",
            email="usuario2@example.com",
            password="TestPassword123",
        )

        self.third_user = User.objects.create_user(
            username="usuario3",
            email="usuario3@example.com",
            password="TestPassword123",
        )

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

    def test_list_following(self):
        Follow.objects.create(
            follower=self.user,
            following=self.other_user,
        )

        Follow.objects.create(
            follower=self.user,
            following=self.third_user,
        )

        response = self.client.get(
            f"/api/users/{self.user.id}/following/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        usernames = {
            user["username"]
            for user in response.data
        }

        self.assertEqual(
            usernames,
            {"usuario2", "usuario3"},
        )

    def test_list_followers(self):
        Follow.objects.create(
            follower=self.other_user,
            following=self.user,
        )

        Follow.objects.create(
            follower=self.third_user,
            following=self.user,
        )

        response = self.client.get(
            f"/api/users/{self.user.id}/followers/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        usernames = {
            user["username"]
            for user in response.data
        }

        self.assertEqual(
            usernames,
            {"usuario2", "usuario3"},
        )

    def test_following_list_requires_authentication(self):
        self.client.credentials()

        response = self.client.get(
            f"/api/users/{self.user.id}/following/"
        )

        self.assertEqual(response.status_code, 401)

    def test_followers_list_requires_authentication(self):
        self.client.credentials()

        response = self.client.get(
            f"/api/users/{self.user.id}/followers/"
        )

        self.assertEqual(response.status_code, 401)
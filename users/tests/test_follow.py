from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Follow

User = get_user_model()


class FollowTests(APITestCase):
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

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

    def test_follow_user(self):
        response = self.client.post(
            f"/api/users/{self.other_user.id}/follow/"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            Follow.objects.filter(
                follower=self.user,
                following=self.other_user,
            ).exists()
        )

    def test_cannot_follow_self(self):
        response = self.client.post(
            f"/api/users/{self.user.id}/follow/"
        )

        self.assertEqual(response.status_code, 400)

    def test_cannot_follow_same_user_twice(self):
        self.client.post(
            f"/api/users/{self.other_user.id}/follow/"
        )

        response = self.client.post(
            f"/api/users/{self.other_user.id}/follow/"
        )

        self.assertEqual(response.status_code, 400)

    def test_unfollow_user(self):
        Follow.objects.create(
            follower=self.user,
            following=self.other_user,
        )

        response = self.client.delete(
            f"/api/users/{self.other_user.id}/follow/"
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            Follow.objects.filter(
                follower=self.user,
                following=self.other_user,
            ).exists()
        )

    def test_cannot_unfollow_user_not_followed(self):
        response = self.client.delete(
            f"/api/users/{self.other_user.id}/follow/"
        )

        self.assertEqual(response.status_code, 400)
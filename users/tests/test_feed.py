from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from posts.models import Post
from users.models import Follow


User = get_user_model()


class FeedTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="TestPassword123",
        )

        self.followed_user = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="TestPassword123",
        )

        self.unfollowed_user = User.objects.create_user(
            username="user3",
            email="user3@example.com",
            password="TestPassword123",
        )

        self.client.force_authenticate(user=self.user)

    def test_feed_shows_posts_from_followed_users(self):
        Follow.objects.create(
            follower=self.user,
            following=self.followed_user,
        )

        Post.objects.create(
            author=self.followed_user,
            content="Post de quem eu sigo",
        )

        response = self.client.get("/api/feed/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["content"],
            "Post de quem eu sigo",
        )

    def test_feed_does_not_show_posts_from_unfollowed_users(self):
        Post.objects.create(
            author=self.unfollowed_user,
            content="Post de quem eu não sigo",
        )

        response = self.client.get("/api/feed/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_feed_without_following_users_is_empty(self):
        response = self.client.get("/api/feed/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_feed_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/feed/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
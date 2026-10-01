from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from posts.models import Comment, Like, Post

User = get_user_model()


class InteractionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="TestPassword123",
        )
        self.other_user = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="TestPassword123",
        )
        self.post = Post.objects.create(
            author=self.other_user,
            content="Post para testar interações",
        )
        self.client.force_authenticate(user=self.user)

    def test_user_can_like_post(self):
        response = self.client.post(
            f"/api/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(Like.objects.count(), 1)
        self.assertEqual(response.data["user"], "user1")

    def test_user_cannot_like_same_post_twice(self):
        Like.objects.create(
            user=self.user,
            post=self.post,
        )

        response = self.client.post(
            f"/api/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(Like.objects.count(), 1)

    def test_user_can_remove_like(self):
        Like.objects.create(
            user=self.user,
            post=self.post,
        )

        response = self.client.delete(
            f"/api/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(Like.objects.count(), 0)

    def test_user_cannot_remove_nonexistent_like(self):
        response = self.client.delete(
            f"/api/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_user_can_create_comment(self):
        response = self.client.post(
            f"/api/posts/{self.post.id}/comments/",
            {"content": "Meu comentário de teste"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(response.data["author"], "user1")
        self.assertEqual(
            response.data["content"],
            "Meu comentário de teste",
        )

    def test_user_can_list_comments(self):
        Comment.objects.create(
            author=self.user,
            post=self.post,
            content="Primeiro comentário",
        )
        Comment.objects.create(
            author=self.other_user,
            post=self.post,
            content="Segundo comentário",
        )

        response = self.client.get(
            f"/api/posts/{self.post.id}/comments/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(len(response.data), 2)

    def test_comment_content_max_length(self):
        content = "a" * 281

        response = self.client.post(
            f"/api/posts/{self.post.id}/comments/",
            {"content": content},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_like_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            f"/api/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_comments_require_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            f"/api/posts/{self.post.id}/comments/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(max_length=160, blank=True)
    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.username


class Follow(models.Model):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following",
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_follow",
            ),
        ]

    def __str__(self):
        return f"{self.follower.username} -> {self.following.username}"
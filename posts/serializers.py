from rest_framework import serializers

from .models import Comment, Like, Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
            "updated_at",
        )


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Like
        fields = (
            "id",
            "user",
            "post",
            "created_at",
        )
        read_only_fields = (
            "id",
            "user",
            "created_at",
        )


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Comment
        fields = (
            "id",
            "author",
            "post",
            "content",
            "created_at",
        )
        read_only_fields = (
            "id",
            "author",
            "post",
            "created_at",
        )
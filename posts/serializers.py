from rest_framework import serializers

from .models import Comment, Like, Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    is_liked = serializers.SerializerMethodField()

    def get_is_liked(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return obj.likes.filter(user=request.user).exists()

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "created_at",
            "updated_at",
            "is_liked",
        )
        read_only_fields = (
            "id",
            "author",
            "created_at",
            "updated_at",
            "is_liked",
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
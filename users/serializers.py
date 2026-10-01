from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Follow


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "name",
            "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "name",
            "bio",
            "profile_image",
        )


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError("Senha atual incorreta.")

        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()

        return user


class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source="follower.username")
    following = serializers.ReadOnlyField(source="following.username")

    class Meta:
        model = Follow
        fields = (
            "id",
            "follower",
            "following",
            "created_at",
        )
        read_only_fields = (
            "id",
            "follower",
            "created_at",
        )
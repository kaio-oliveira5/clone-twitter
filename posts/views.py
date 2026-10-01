from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Follow

from .models import Comment, Like, Post
from .serializers import CommentSerializer, LikeSerializer, PostSerializer


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        following_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list("following_id", flat=True)

        return Post.objects.filter(
            author_id__in=following_ids
        )


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        like, created = Like.objects.get_or_create(
            user=request.user,
            post=post,
        )

        if not created:
            return Response(
                {"detail": "Você já curtiu este post."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = LikeSerializer(like)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, post_id):
        try:
            like = Like.objects.get(
                user=request.user,
                post_id=post_id,
            )
        except Like.DoesNotExist:
            return Response(
                {"detail": "Você não curtiu este post."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        like.delete()

        return Response(
            {"detail": "Curtida removida com sucesso."},
            status=status.HTTP_200_OK,
        )


class PostCommentsView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(
            post_id=self.kwargs["post_id"]
        )

    def perform_create(self, serializer):
        try:
            Post.objects.get(id=self.kwargs["post_id"])
        except Post.DoesNotExist:
            from rest_framework.exceptions import NotFound

            raise NotFound("Post não encontrado.")

        serializer.save(
            author=self.request.user,
            post_id=self.kwargs["post_id"],
        )
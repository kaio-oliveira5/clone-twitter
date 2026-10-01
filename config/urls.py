from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from posts.views import (
    FeedView,
    LikePostView,
    PostCommentsView,
    PostListCreateView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from users.views import (
    ChangePasswordView,
    FollowersListView,
    FollowingListView,
    FollowUserView,
    MeView,
    RegisterView,
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "api/auth/login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "api/auth/me/",
        MeView.as_view(),
        name="me",
    ),
    path(
        "api/auth/password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
        "api/posts/",
        PostListCreateView.as_view(),
        name="posts",
    ),
    path(
        "api/posts/<int:post_id>/like/",
        LikePostView.as_view(),
        name="post-like",
    ),
    path(
        "api/posts/<int:post_id>/comments/",
        PostCommentsView.as_view(),
        name="post-comments",
    ),
    path(
        "api/feed/",
        FeedView.as_view(),
        name="feed",
    ),

    path(
        "api/users/<int:user_id>/follow/",
        FollowUserView.as_view(),
        name="follow-user",
    ),
    path(
        "api/users/<int:user_id>/following/",
        FollowingListView.as_view(),
        name="following-list",
    ),
    path(
        "api/users/<int:user_id>/followers/",
        FollowersListView.as_view(),
        name="followers-list",
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
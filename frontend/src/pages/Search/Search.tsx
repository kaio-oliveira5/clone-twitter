import { useEffect, useState } from "react";
import {
  followUser,
  getFollowing,
  getProfile,
  searchUsers,
  unfollowUser,
  type UserProfile,
} from "../../services/auth";
import styles from "./Search.module.css";

function Search() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadFollowing() {
      try {
        const profileResponse = await getProfile();

        setCurrentUserId(profileResponse.id);

        const following = await getFollowing(profileResponse.id);

        setFollowingIds(following.map((user) => user.id));
      } catch (error) {
        console.error("Erro ao carregar usuários seguidos:", error);
      }
    }

    loadFollowing();
  }, []);

  async function handleSearch() {
    const searchTerm = search.trim();

    if (!searchTerm) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);

      const results = await searchUsers(searchTerm);

      setUsers(results);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFollow(userId: number) {
    try {
      setLoadingUserId(userId);

      await followUser(userId);

      window.dispatchEvent(
        new CustomEvent("followUpdated", {
          detail: { userId: currentUserId },
        }),
      );

      setFollowingIds((currentIds) => [...currentIds, userId]);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    } finally {
      setLoadingUserId(null);
    }
  }

  async function handleUnfollow(userId: number) {
    try {
      setLoadingUserId(userId);

      await unfollowUser(userId);

      window.dispatchEvent(
        new CustomEvent("followUpdated", {
          detail: { userId: currentUserId },
        }),
      );

      setFollowingIds((currentIds) => currentIds.filter((id) => id !== userId));
    } catch (error) {
      console.error("Erro ao deixar de seguir usuário:", error);
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <section className={styles.search}>
      <h1 className={styles.title}>Buscar usuários</h1>

      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Digite um nome ou usuário"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          className={styles.searchButton}
          type="button"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {isLoading && <p className={styles.message}>Buscando usuários...</p>}

      {!isLoading && users.length === 0 && search.trim() && (
        <p className={styles.message}>Nenhum usuário encontrado.</p>
      )}

      <div className={styles.results}>
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const isFollowing = followingIds.includes(user.id);
          const isButtonLoading = loadingUserId === user.id;

          return (
            <article className={styles.userCard} key={user.id}>
              {user.profile_image ? (
                <img
                  className={styles.avatar}
                  src={user.profile_image}
                  alt={`Foto de perfil de ${user.username}`}
                  width={48}
                  height={48}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div className={styles.userInfo}>
                <strong className={styles.userName}>
                  {user.name || user.username}
                </strong>

                <p className={styles.username}>@{user.username}</p>
              </div>

              {isCurrentUser ? (
                <span className={styles.you}>Você</span>
              ) : isFollowing ? (
                <button
                  className={styles.followButton}
                  type="button"
                  onClick={() => handleUnfollow(user.id)}
                  disabled={isButtonLoading}
                >
                  {isButtonLoading ? "Aguarde..." : "Deixar de seguir"}
                </button>
              ) : (
                <button
                  className={styles.followButton}
                  type="button"
                  onClick={() => handleFollow(user.id)}
                  disabled={isButtonLoading}
                >
                  {isButtonLoading ? "Aguarde..." : "Seguir"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Search;

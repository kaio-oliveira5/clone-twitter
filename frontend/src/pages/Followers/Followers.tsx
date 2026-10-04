import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  followUser,
  getFollowers,
  getFollowing,
  getProfile,
  unfollowUser,
  type UserProfile,
} from "../../services/auth";
import styles from "./Followers.module.css";

function Followers() {
  const [searchParams] = useSearchParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);

  const followingSectionRef = useRef<HTMLElement | null>(null);
  const followersSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function loadFollowers() {
      try {
        const user = await getProfile();

        const [followersData, followingData] = await Promise.all([
          getFollowers(user.id),
          getFollowing(user.id),
        ]);

        setProfile(user);
        setFollowers(followersData);
        setFollowing(followingData);
        setFollowingUsers(followingData.map((item) => item.id));
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar seguidores e seguindo.");
      } finally {
        setLoading(false);
      }
    }

    loadFollowers();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const tab = searchParams.get("tab");

    if (tab === "following") {
      followingSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (tab === "followers") {
      followersSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, searchParams]);

  async function handleFollow(userId: number) {
    try {
      await followUser(userId);

      const user = followers.find((item) => item.id === userId);

      if (user) {
        setFollowing((current) => [...current, user]);
      }

      setFollowingUsers((current) => [...current, userId]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível seguir este usuário.");
    }
  }

  async function handleUnfollow(userId: number) {
    try {
      await unfollowUser(userId);

      setFollowing((current) => current.filter((user) => user.id !== userId));

      setFollowingUsers((current) => current.filter((id) => id !== userId));
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível deixar de seguir.");
    }
  }

  if (loading) {
    return <main className={styles.loading}>Carregando seguidores...</main>;
  }

  if (errorMessage && !profile) {
    return <main className={styles.loading}>{errorMessage}</main>;
  }

  if (!profile) {
    return <main className={styles.loading}>Perfil não encontrado.</main>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Seguidores e seguindo</h1>
          <p>Gerencie as pessoas que você segue e veja quem segue você.</p>
        </header>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.sections}>
          <section ref={followingSectionRef} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Seguindo</h2>
              <span>{following.length}</span>
            </div>

            {following.length === 0 ? (
              <div className={styles.empty}>
                <p>Você ainda não segue ninguém.</p>
              </div>
            ) : (
              <div className={styles.userList}>
                {following.map((user) => (
                  <article className={styles.user} key={user.id}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={`Foto de perfil de ${user.username}`}
                          />
                        ) : (
                          <span>{user.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div>
                        <h3>{user.name || user.username}</h3>
                        <p>@{user.username}</p>
                      </div>
                    </div>

                    <button
                      className={styles.unfollowButton}
                      type="button"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Deixar de seguir
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section ref={followersSectionRef} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Seguidores</h2>
              <span>{followers.length}</span>
            </div>

            {followers.length === 0 ? (
              <div className={styles.empty}>
                <p>Você ainda não tem seguidores.</p>
              </div>
            ) : (
              <div className={styles.userList}>
                {followers.map((user) => {
                  const isFollowing = followingUsers.includes(user.id);

                  return (
                    <article className={styles.user} key={user.id}>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt={`Foto de perfil de ${user.username}`}
                            />
                          ) : (
                            <span>{user.username.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        <div>
                          <h3>{user.name || user.username}</h3>
                          <p>@{user.username}</p>
                        </div>
                      </div>

                      {isFollowing ? (
                        <button
                          className={styles.unfollowButton}
                          type="button"
                          onClick={() => handleUnfollow(user.id)}
                        >
                          Deixar de seguir
                        </button>
                      ) : (
                        <button
                          className={styles.followButton}
                          type="button"
                          onClick={() => handleFollow(user.id)}
                        >
                          Seguir
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Followers;

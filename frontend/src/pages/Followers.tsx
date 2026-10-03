import { useEffect, useState } from "react";
import {
  followUser,
  getFollowers,
  getFollowing,
  getProfile,
  unfollowUser,
  type UserProfile,
} from "../services/auth";

function Followers() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);

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
    return <main>Carregando seguidores...</main>;
  }

  if (errorMessage && !profile) {
    return <main>{errorMessage}</main>;
  }

  if (!profile) {
    return <main>Perfil não encontrado.</main>;
  }

  return (
    <main>
      <h1>Seguidores e seguindo</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <section>
        <h2>Seguindo ({following.length})</h2>

        {following.length === 0 ? (
          <p>Você ainda não segue ninguém.</p>
        ) : (
          following.map((user) => (
            <article key={user.id}>
              <h3>{user.name}</h3>

              <p>@{user.username}</p>

              <button type="button" onClick={() => handleUnfollow(user.id)}>
                Deixar de seguir
              </button>
            </article>
          ))
        )}
      </section>

      <section>
        <h2>Seguidores ({followers.length})</h2>

        {followers.length === 0 ? (
          <p>Você ainda não tem seguidores.</p>
        ) : (
          followers.map((user) => (
            <article key={user.id}>
              <h3>{user.name}</h3>

              <p>@{user.username}</p>

              {!followingUsers.includes(user.id) && (
                <button type="button" onClick={() => handleFollow(user.id)}>
                  Seguir
                </button>
              )}

              {followingUsers.includes(user.id) && (
                <button type="button" onClick={() => handleUnfollow(user.id)}>
                  Deixar de seguir
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Followers;

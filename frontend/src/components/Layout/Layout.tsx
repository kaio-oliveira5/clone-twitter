import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
  getFollowers,
  getFollowing,
  getProfile,
  type UserProfile,
} from "../../services/auth";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

function Layout({
  children,
  onLogout,
  isDarkMode,
  onToggleTheme,
}: LayoutProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  async function loadFollowCounts(userId: number) {
    try {
      const [followers, following] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId),
      ]);

      setFollowersCount(followers.length);
      setFollowingCount(following.length);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let userId: number | null = null;

    async function loadProfileSidebar() {
      try {
        const user = await getProfile();

        userId = user.id;

        setProfile(user);

        await loadFollowCounts(user.id);
      } catch (error) {
        console.error(error);
      }
    }

    function handleProfileUpdated(event: Event) {
      const customEvent = event as CustomEvent<UserProfile>;

      setProfile(customEvent.detail);
    }

    function handleFollowUpdated() {
      if (userId !== null) {
        loadFollowCounts(userId);
      }
    }

    loadProfileSidebar();

    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("followUpdated", handleFollowUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("followUpdated", handleFollowUpdated);
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Navbar
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {profile && (
              <>
                {profile.profile_image && (
                  <img
                    className={styles.profileImage}
                    src={profile.profile_image}
                    alt={`Foto de perfil de ${profile.username}`}
                  />
                )}

                <h2 className={styles.profileName}>{profile.name}</h2>

                <p className={styles.username}>@{profile.username}</p>

                {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

                <div className={styles.stats}>
                  <Link className={styles.stat} to="/followers?tab=following">
                    <strong>{followingCount}</strong>
                    <span>Seguindo</span>
                  </Link>

                  <Link className={styles.stat} to="/followers?tab=followers">
                    <strong>{followersCount}</strong>
                    <span>Seguidores</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>

        <main className={styles.main}>{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;

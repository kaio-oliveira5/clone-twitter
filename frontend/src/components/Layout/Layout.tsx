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
}

function Layout({ children, onLogout }: LayoutProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    async function loadProfileSidebar() {
      try {
        const user = await getProfile();

        const [followers, following] = await Promise.all([
          getFollowers(user.id),
          getFollowing(user.id),
        ]);

        setProfile(user);
        setFollowersCount(followers.length);
        setFollowingCount(following.length);
      } catch (error) {
        console.error(error);
      }
    }

    loadProfileSidebar();
  }, []);

  return (
    <div className={styles.layout}>
      <Navbar onLogout={onLogout} />

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

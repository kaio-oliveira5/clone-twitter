import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  type UserProfile,
} from "../../services/auth";
import styles from "./Profile.module.css";

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
        setName(data.name);
        setBio(data.bio);
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedProfile = await updateProfile(name, bio, profileImage);

      setProfile(updatedProfile);
      setName(updatedProfile.name);
      setBio(updatedProfile.bio);
      setProfileImage(undefined);
      setSuccessMessage("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(file);
  }

  if (loading) {
    return <main className={styles.loading}>Carregando perfil...</main>;
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
          <h1>Meu perfil</h1>
          <p>Visualize e atualize suas informações pessoais.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={`Foto de perfil de ${profile.username}`}
                />
              ) : (
                <span>{profile.username.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className={styles.profileInfo}>
              <h2>{profile.name || profile.username}</h2>
              <p>@{profile.username}</p>
              <span>{profile.email}</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="profile-image">Foto de perfil</label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {profileImage && (
                <p className={styles.selectedFile}>
                  Imagem selecionada: {profileImage.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="name">Nome</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="bio">Bio</label>
                <span>{bio.length}/160</span>
              </div>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={160}
                rows={5}
              />
            </div>

            {successMessage && (
              <p className={styles.success}>{successMessage}</p>
            )}

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;

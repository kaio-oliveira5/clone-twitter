import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  type UserProfile,
} from "../../services/auth";

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
    return <main>Carregando perfil...</main>;
  }

  if (errorMessage && !profile) {
    return <main>{errorMessage}</main>;
  }

  if (!profile) {
    return <main>Perfil não encontrado.</main>;
  }

  return (
    <main>
      <h1>Meu perfil</h1>

      {profile.profile_image && (
        <img
          src={profile.profile_image}
          alt={`Foto de perfil de ${profile.username}`}
          width="120"
          height="120"
        />
      )}

      <p>@{profile.username}</p>

      <p>{profile.email}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile-image">Foto de perfil</label>

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {profileImage && <p>Imagem selecionada: {profileImage.name}</p>}
        </div>

        <div>
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

        <div>
          <label htmlFor="bio">Bio</label>

          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={160}
            rows={4}
          />

          <span>{bio.length}/160</span>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      {successMessage && <p>{successMessage}</p>}

      {errorMessage && <p>{errorMessage}</p>}
    </main>
  );
}

export default Profile;

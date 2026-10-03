import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

function Navbar({ onLogout }: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();

    navigate("/login");
  }

  return (
    <nav>
      <Link to="/feed">Feed</Link>

      <Link to="/profile">Meu perfil</Link>

      <Link to="/followers">Seguidores</Link>

      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </nav>
  );
}

export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/auth";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login(username, password);

      onLogin();

      navigate("/feed");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuário</label>

          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>

          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>

      <p>
        Ainda não tem uma conta? <Link to="/register">Criar conta</Link>
      </p>
    </main>
  );
}

export default Login;

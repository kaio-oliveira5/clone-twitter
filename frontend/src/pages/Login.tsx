import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login(username, password);

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
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}

export default Login;

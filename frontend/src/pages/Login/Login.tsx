import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/auth";
import styles from "./Login.module.css";

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
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Entrar</h1>
          <p>Entre na sua conta para continuar.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
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

          <div className={styles.field}>
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

          <button className={styles.submitButton} type="submit">
            Entrar
          </button>
        </form>

        <p className={styles.registerText}>
          Ainda não tem uma conta?{" "}
          <Link className={styles.registerLink} to="/register">
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;

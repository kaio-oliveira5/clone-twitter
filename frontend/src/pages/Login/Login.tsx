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
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const startTime = Date.now();

    try {
      await login(username, password);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(1000 - elapsedTime, 0);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      onLogin();

      navigate("/feed");
    } catch (error: any) {
      console.error(error);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(1000 - elapsedTime, 0);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (error.response?.status === 401) {
        setErrorMessage("Usuário ou senha incorretos.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Verifique os dados informados e tente novamente.");
      } else {
        setErrorMessage("Não foi possível entrar. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
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

          {errorMessage && (
            <p role="alert" className={styles.errorMessage}>
              {errorMessage}
            </p>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess("");
    setErrorMessage("");

    try {
      await api.post("/auth/register/", {
        username,
        email,
        name,
        password,
      });

      setSuccess("Conta criada com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        console.log("Erro do backend:", error.response.data);

        const data = error.response.data;

        if (data.username) {
          setErrorMessage(data.username[0]);
        } else if (data.email) {
          setErrorMessage(data.email[0]);
        } else if (data.password) {
          setErrorMessage(data.password[0]);
        } else {
          setErrorMessage("Não foi possível criar a conta.");
        }
      } else {
        setErrorMessage("Não foi possível conectar ao servidor.");
      }
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>Criar conta</h1>
          <p>Crie sua conta para começar.</p>
        </div>

        {success && <p className={styles.success}>{success}</p>}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

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
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="name">Nome</label>

            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
            Criar conta
          </button>
        </form>
      </section>
    </main>
  );
}

export default Register;

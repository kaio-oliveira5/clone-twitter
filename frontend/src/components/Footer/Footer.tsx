import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        © {currentYear} Clone Twitter · Projeto desenvolvido para fins de estudo
        por Kaio Oliveira.
      </p>
    </footer>
  );
}

export default Footer;

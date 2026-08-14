import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>🍕 <strong>PizzaPub</strong></p>
        <p className={styles.copy}>© {new Date().getFullYear()} PizzaPub · Todos os direitos reservados</p>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { CartIcon } from '@/components/cart/CartIcon'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="PizzaPub — Home">
          <span className={styles.logoIcon}>🍕</span>
          <span className={styles.logoText}>Pizza<strong>Pub</strong></span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Cardápio</Link>
          <Link to="/checkout" className={styles.navLink}>Meu Pedido</Link>
        </nav>

        <CartIcon />
      </div>
    </header>
  )
}

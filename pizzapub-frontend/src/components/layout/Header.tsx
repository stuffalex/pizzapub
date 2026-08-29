import { Link } from 'react-router-dom'
import { CartIcon } from '@/components/cart/CartIcon'
import { useConfigStore } from '@/store/config.store'
import styles from './Header.module.css'

export function Header() {
  const { nomeEmpresa, logoUrl } = useConfigStore()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label={`${nomeEmpresa} — Home`}>
          {logoUrl ? (
            <img src={logoUrl} alt={nomeEmpresa} className={styles.logoImg} />
          ) : (
            <span className={styles.logoIcon}>🍕</span>
          )}
          <span className={styles.logoText}>{nomeEmpresa}</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Cardápio</Link>
          <Link to="/meus-pedidos" className={styles.navLink}>Meus Pedidos</Link>
          <Link to="/checkout" className={styles.navLink}>Meu Pedido</Link>
        </nav>

        <CartIcon />
      </div>
    </header>
  )
}

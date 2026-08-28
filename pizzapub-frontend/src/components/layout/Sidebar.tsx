import { NavLink, useNavigate } from 'react-router-dom'
import { Pizza, LayoutDashboard, LogOut } from 'lucide-react'
import styles from './Sidebar.module.css'
import { useAuthStore } from '@/store/auth.store'

export function Sidebar() {
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>🍕</div>
        <div>
          <h1 className={styles.title}>PizzaPub</h1>
          <span className={styles.subtitle}>Admin Panel</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          end
        >
          <LayoutDashboard size={20} /> Pedidos
        </NavLink>
        <NavLink 
          to="/produtos" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <Pizza size={20} /> Cardápio
        </NavLink>
        <NavLink 
          to="/categorias" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard size={20} /> Categorias
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  )
}

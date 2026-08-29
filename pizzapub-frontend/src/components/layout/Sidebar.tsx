import { NavLink, useNavigate } from 'react-router-dom'
import { Pizza, LayoutDashboard, Settings, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useConfigStore } from '@/store/config.store'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const logout = useAuthStore(s => s.logout)
  const { nomeEmpresa, logoUrl } = useConfigStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          {logoUrl ? (
            <img src={logoUrl} alt={nomeEmpresa} style={{ width: '2rem', height: '2rem', objectFit: 'contain' }} />
          ) : (
            '🍕'
          )}
        </div>
        <div>
          <h1 className={styles.title}>{nomeEmpresa}</h1>
          <span className={styles.subtitle}>Painel Gerencial</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          end
        >
          <LayoutDashboard size={20} /> Pedidos
        </NavLink>
        <NavLink 
          to="/admin/produtos" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <Pizza size={20} /> Cardápio
        </NavLink>
        <NavLink 
          to="/admin/categorias" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard size={20} /> Categorias
        </NavLink>
        <NavLink 
          to="/admin/configuracoes" 
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <Settings size={20} /> Configurações & Logo
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <NavLink to="/" className={styles.link} style={{ marginBottom: '0.5rem' }}>
          <ArrowLeft size={18} /> Ver Cardápio
        </NavLink>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/core/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/Button'
import { LogIn } from 'lucide-react'
import styles from './LoginPage.module.css'
import toast from 'react-hot-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setToken = useAuthStore((s) => s.setToken)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      setToken(res.token)
      toast.success('Login efetuado com sucesso!')
      navigate(from, { replace: true })
    } catch {
      toast.error('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🍕</div>
        <h1 className={styles.title}>PizzaPub</h1>
        <p className={styles.sub}>Painel de Controle</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>E-mail de acesso</label>
            <input
              type="email"
              className={styles.input}
              placeholder="admin@pizzapub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            <LogIn size={18} /> Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

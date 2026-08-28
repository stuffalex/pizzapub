import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/core/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/Button'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailId = useId()
  const passId = useId()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      setToken(res.token)
      navigate('/')
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🍕</div>
        <h1 className={styles.title}>Entrar no PizzaPub</h1>
        <p className={styles.sub}>Acesso exclusivo para equipe interna</p>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor={emailId} className={styles.label}>E-mail</label>
            <input
              id={emailId}
              type="email"
              className={styles.input}
              placeholder="admin@pizzapub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor={passId} className={styles.label}>Senha</label>
            <input
              id={passId}
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button id="login-submit" type="submit" size="lg" loading={loading} style={{ width: '100%' }}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

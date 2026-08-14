import styles from './Badge.module.css'

type BadgeVariant = 'primary' | 'accent' | 'success' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  )
}

import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: borderRadius ?? undefined }}
    />
  )
}

export function PizzaCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton height="200px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
      <div className={styles.cardBody}>
        <Skeleton height="1.25rem" width="70%" />
        <Skeleton height="0.875rem" width="90%" />
        <Skeleton height="0.875rem" width="60%" />
        <div className={styles.cardFooter}>
          <Skeleton height="1.5rem" width="5rem" />
          <Skeleton height="2.5rem" width="9rem" borderRadius="var(--radius-md)" />
        </div>
      </div>
    </div>
  )
}

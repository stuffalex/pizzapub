import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart.store'
import { Button } from '@/components/ui/Button'
import { CarrinhoItem } from './CarrinhoItem'
import styles from './CarrinhoDrawer.module.css'

interface CarrinhoDrawerProps {
  open: boolean
  onClose: () => void
}

export function CarrinhoDrawer({ open, onClose }: CarrinhoDrawerProps) {
  const navigate = useNavigate()
  const { items, total, totalItens } = useCartStore()

  function handleCheckout() {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={onClose} aria-hidden />
      )}
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-label="Carrinho de compras"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            🛒 Carrinho
            {totalItens() > 0 && (
              <span className={styles.count}>{totalItens()}</span>
            )}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar carrinho">✕</button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🍕</span>
              <p>Seu carrinho está vazio</p>
              <p className={styles.emptySub}>Adicione pizzas para começar!</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <CarrinhoItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <strong className={styles.total}>
                {total().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
            <Button
              id="checkout-btn"
              size="lg"
              onClick={handleCheckout}
              style={{ width: '100%' }}
            >
              Finalizar Pedido →
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

import { useState } from 'react'
import { useCartStore } from '@/store/cart.store'
import { CarrinhoDrawer } from '@/features/carrinho/CarrinhoDrawer'
import styles from './CartIcon.module.css'

export function CartIcon() {
  const [open, setOpen] = useState(false)
  const totalItens = useCartStore((s) => s.totalItens())

  return (
    <>
      <button
        id="cart-icon-btn"
        className={styles.btn}
        onClick={() => setOpen(true)}
        aria-label={`Carrinho — ${totalItens} itens`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {totalItens > 0 && (
          <span className={styles.badge} aria-hidden>
            {totalItens > 9 ? '9+' : totalItens}
          </span>
        )}
      </button>

      <CarrinhoDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}

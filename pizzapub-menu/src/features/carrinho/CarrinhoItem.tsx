import type { CarrinhoItem as ICarrinhoItem } from '@/types/pedido'
import { useCartStore } from '@/store/cart.store'
import styles from './CarrinhoItem.module.css'

export function CarrinhoItem({ item }: { item: ICarrinhoItem }) {
  const { removeItem, updateQuantidade } = useCartStore()

  const nomesSabores = item.sabores.map((s) => s.nome).join(' + ')
  const subtotal = item.precoUnitario * item.quantidade

  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <p className={styles.nome}>{nomesSabores}</p>
        {item.observacao && (
          <p className={styles.obs}>📝 {item.observacao}</p>
        )}
        <p className={styles.preco}>
          {item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          {item.sabores.length > 1 && <span className={styles.meioBadge}>meio a meio</span>}
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            className={styles.qtyBtn}
            onClick={() =>
              item.quantidade <= 1
                ? removeItem(item.id)
                : updateQuantidade(item.id, item.quantidade - 1)
            }
            aria-label="Diminuir quantidade"
          >−</button>
          <span>{item.quantidade}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantidade(item.id, item.quantidade + 1)}
            aria-label="Aumentar quantidade"
          >+</button>
        </div>
        <p className={styles.subtotal}>
          {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <button
          className={styles.removeBtn}
          onClick={() => removeItem(item.id)}
          aria-label="Remover item"
        >
          🗑️
        </button>
      </div>
    </li>
  )
}

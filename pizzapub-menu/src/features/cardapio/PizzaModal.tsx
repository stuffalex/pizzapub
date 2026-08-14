import { useState, useId } from 'react'
import { v4 as uuid } from 'uuid'
import type { Produto } from '@/types/produto'
import type { CarrinhoItem } from '@/types/pedido'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart.store'
import styles from './PizzaModal.module.css'

interface PizzaModalProps {
  produto: Produto
  open: boolean
  onClose: () => void
  allProdutos: Produto[]
}

export function PizzaModal({ produto, open, onClose, allProdutos }: PizzaModalProps) {
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [meioAMeio, setMeioAMeio] = useState(false)
  const [segundoSabor, setSegundoSabor] = useState<Produto | null>(null)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const obsId = useId()

  const sabores = meioAMeio && segundoSabor ? [produto, segundoSabor] : [produto]
  const precoUnitario = Math.max(...sabores.map((s) => s.preco))

  function handleAdd() {
    const item: CarrinhoItem = {
      id: uuid(),
      sabores,
      quantidade,
      observacao,
      precoUnitario,
    }
    addItem(item)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
      resetForm()
    }, 900)
  }

  function resetForm() {
    setQuantidade(1)
    setObservacao('')
    setMeioAMeio(false)
    setSegundoSabor(null)
  }

  const outrosProdutos = allProdutos.filter((p) => p.id !== produto.id)

  return (
    <Modal open={open} onClose={onClose} title={produto.nome}>
      <div className={styles.content}>
        <img
          src={produto.urlImagem || `https://placehold.co/520x240/C62828/fff?text=${encodeURIComponent(produto.nome)}`}
          alt={produto.nome}
          className={styles.image}
        />
        <p className={styles.descricao}>{produto.descricao}</p>

        {/* Meio a meio */}
        {outrosProdutos.length > 0 && (
          <div className={styles.meioSection}>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                checked={meioAMeio}
                onChange={(e) => {
                  setMeioAMeio(e.target.checked)
                  if (!e.target.checked) setSegundoSabor(null)
                }}
              />
              <span>Quero meio a meio 🍕🍕</span>
            </label>

            {meioAMeio && (
              <div className={styles.selectWrap}>
                <label className={styles.label}>2º sabor</label>
                <select
                  className={styles.select}
                  value={segundoSabor?.id ?? ''}
                  onChange={(e) =>
                    setSegundoSabor(
                      outrosProdutos.find((p) => p.id === Number(e.target.value)) ?? null
                    )
                  }
                >
                  <option value="">Selecione o 2º sabor...</option>
                  {outrosProdutos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Preço */}
        <div className={styles.precoRow}>
          <span className={styles.precoLabel}>Valor unitário</span>
          <span className={styles.preco}>
            {precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {meioAMeio && (
            <span className={styles.precoNote}>
              (maior entre os sabores)
            </span>
          )}
        </div>

        {/* Quantidade */}
        <div className={styles.row}>
          <span className={styles.label}>Quantidade</span>
          <div className={styles.qtyControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              aria-label="Diminuir"
            >−</button>
            <span className={styles.qty}>{quantidade}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantidade((q) => q + 1)}
              aria-label="Aumentar"
            >+</button>
          </div>
        </div>

        {/* Observação */}
        <div className={styles.obsWrap}>
          <label htmlFor={obsId} className={styles.label}>Observação (opcional)</label>
          <textarea
            id={obsId}
            className={styles.textarea}
            placeholder="Ex: sem cebola, borda recheada..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={2}
          />
        </div>

        {/* Total */}
        <div className={styles.totalRow}>
          <span>Total</span>
          <strong className={styles.total}>
            {(precoUnitario * quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </strong>
        </div>

        <Button
          id={`confirm-add-${produto.id}`}
          size="lg"
          onClick={handleAdd}
          disabled={meioAMeio && !segundoSabor}
          loading={added}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {added ? 'Adicionado! ✓' : '🛒 Adicionar ao Carrinho'}
        </Button>
      </div>
    </Modal>
  )
}

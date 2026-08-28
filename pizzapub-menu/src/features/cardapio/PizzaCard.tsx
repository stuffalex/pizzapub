import { useState } from 'react'
import type { Produto } from '@/types/produto'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PizzaModal } from './PizzaModal'
import styles from './PizzaCard.module.css'

interface PizzaCardProps {
  produto: Produto
  index: number
  allProdutos: Produto[]
}

export function PizzaCard({ produto, index, allProdutos }: PizzaCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const isPopular = produto.preco >= 50
  const isNovo = produto.id <= 3

  return (
    <>
      <article
        className={styles.card}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <button
          className={styles.imageWrap}
          onClick={() => setModalOpen(true)}
          aria-label={`Ver detalhes de ${produto.nome}`}
        >
          <img
            src={produto.urlImagem || `https://placehold.co/400x280/C62828/fff?text=${encodeURIComponent(produto.nome)}`}
            alt={produto.nome}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageBadges}>
            {isNovo && <Badge variant="accent">Novo</Badge>}
            {isPopular && <Badge variant="primary">Popular</Badge>}
          </div>
        </button>

        <div className={styles.body}>
          <h3 className={styles.nome}>{produto.nome}</h3>
          <p className={styles.descricao}>{produto.descricao}</p>

          <div className={styles.footer}>
            <span className={styles.preco}>
              {produto.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
            <Button
              id={`add-to-cart-${produto.id}`}
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              + Adicionar
            </Button>
          </div>
        </div>
      </article>

      <PizzaModal
        produto={produto}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        allProdutos={allProdutos}
      />
    </>
  )
}

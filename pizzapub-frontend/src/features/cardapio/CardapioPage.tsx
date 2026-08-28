import { useState, useMemo } from 'react'
import { useProdutos } from '@/hooks/useProdutos'
import { PizzaCard } from './PizzaCard'
import { PizzaCardSkeleton } from '@/components/ui/Skeleton'
import styles from './CardapioPage.module.css'

export function CardapioPage() {
  const { data: produtos, isLoading, isError } = useProdutos()
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos')

  const categorias = useMemo(() => {
    if (!produtos) return ['Todos']
    const cats = new Set<string>()
    produtos.forEach((p) => {
      if (p.categoria?.nome) {
        cats.add(p.categoria.nome)
      } else {
        cats.add('Sem Categoria')
      }
    })
    return ['Todos', ...Array.from(cats)]
  }, [produtos])

  const produtosFiltrados = useMemo(() => {
    if (!produtos) return []
    let filtrados = produtos

    if (categoriaSelecionada !== 'Todos') {
      filtrados = filtrados.filter(p => (p.categoria?.nome || 'Sem Categoria') === categoriaSelecionada)
    }

    if (busca.trim()) {
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(busca.toLowerCase())
      )
    }
    return filtrados
  }, [produtos, busca, categoriaSelecionada])

  return (
    <section className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Nosso <span className={styles.heroHighlight}>Cardápio</span>
          </h1>
          <p className={styles.heroSub}>
            Ingredientes selecionados, sabor de verdade. Escolha e aproveite!
          </p>

          {/* Busca */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              id="busca-pizza"
              type="search"
              className={styles.searchInput}
              placeholder="Buscar por nome ou ingrediente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar produto"
            />
            {busca && (
              <button
                className={styles.searchClear}
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Abas de Categoria */}
          {!isLoading && categorias.length > 1 && (
            <div className={styles.tabsWrap}>
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`${styles.tabBtn} ${categoriaSelecionada === cat ? styles.tabActive : ''}`}
                  onClick={() => setCategoriaSelecionada(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={`container ${styles.gridWrap}`}>
        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <PizzaCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.error}>
            <p>😕 Não foi possível carregar o cardápio.</p>
            <p className={styles.errorSub}>Verifique se o servidor está rodando em <code>localhost:8080</code></p>
          </div>
        )}

        {!isLoading && !isError && produtosFiltrados.length === 0 && (
          <div className={styles.empty}>
            <p>🍕 Nenhum produto encontrado.</p>
          </div>
        )}

        {!isLoading && !isError && produtosFiltrados.length > 0 && (
          <>
            {busca && (
              <p className={styles.resultCount}>
                {produtosFiltrados.length} resultado{produtosFiltrados.length !== 1 ? 's' : ''} para "{busca}"
              </p>
            )}
            <div className={styles.grid}>
              {produtosFiltrados.map((produto, i) => (
                <PizzaCard
                  key={produto.id}
                  produto={produto}
                  index={i}
                  allProdutos={produtos ?? []}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

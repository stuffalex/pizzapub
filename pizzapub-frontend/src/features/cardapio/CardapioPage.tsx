import { useState, useMemo, useEffect } from 'react'
import { useProdutos } from '@/hooks/useProdutos'
import { PizzaCard } from './PizzaCard'
import { PizzaCardSkeleton } from '@/components/ui/Skeleton'
import styles from './CardapioPage.module.css'

export function CardapioPage() {
  const { data: produtos, isLoading, isError } = useProdutos()
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos')

  // Agrupa categorias e ordena
  const categorias = useMemo(() => {
    if (!produtos) return ['Todos']
    const cats = new Map<string, number>()
    produtos.forEach((p) => {
      const nomeCat = p.categoria?.nome || 'Outros'
      const ordem = p.categoria?.ordem ?? 99
      cats.set(nomeCat, ordem)
    })
    const sortedCats = Array.from(cats.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([nome]) => nome)

    return ['Todos', ...sortedCats]
  }, [produtos])

  // Agrupamento de produtos por categoria
  const produtosPorCategoria = useMemo(() => {
    if (!produtos) return {}
    const mapa: Record<string, typeof produtos> = {}

    produtos.forEach((p) => {
      // Se tiver busca, filtra pelo termo
      if (busca.trim()) {
        const match =
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.descricao.toLowerCase().includes(busca.toLowerCase())
        if (!match) return
      }

      const catNome = p.categoria?.nome || 'Outros'
      if (!mapa[catNome]) {
        mapa[catNome] = []
      }
      mapa[catNome].push(p)
    })

    return mapa
  }, [produtos, busca])

  // Total de produtos encontrados
  const totalFiltrados = useMemo(() => {
    return Object.values(produtosPorCategoria).reduce((acc, list) => acc + list.length, 0)
  }, [produtosPorCategoria])

  // Scroll suave até a categoria
  const handleSelectCategoria = (cat: string) => {
    setCategoriaAtiva(cat)
    if (cat === 'Todos') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const slug = cat.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const el = document.getElementById(`secao-${slug}`)
    if (el) {
      const offset = 140
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: pos, behavior: 'smooth' })
    }
  }

  // ScrollSpy para atualizar a categoria ativa enquanto rola a página
  useEffect(() => {
    if (busca.trim()) return

    const handleScroll = () => {
      const sections = categorias
        .filter(c => c !== 'Todos')
        .map(c => {
          const slug = c.toLowerCase().replace(/[^a-z0-9]/g, '-')
          return { cat: c, el: document.getElementById(`secao-${slug}`) }
        })
        .filter(s => s.el !== null)

      const scrollPos = window.scrollY + 160

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i]
        if (sec.el && sec.el.offsetTop <= scrollPos) {
          setCategoriaAtiva(sec.cat)
          return
        }
      }
      if (window.scrollY < 200) {
        setCategoriaAtiva('Todos')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categorias, busca])

  return (
    <section className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Nosso <span className={styles.heroHighlight}>Cardápio</span>
          </h1>
          <p className={styles.heroSub}>
            Pizzas artesanais, bebidas geladas e muito mais. Peça agora!
          </p>

          {/* Busca */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              id="busca-pizza"
              type="search"
              className={styles.searchInput}
              placeholder="Buscar pizza, bebida, ingrediente..."
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
        </div>
      </div>

      {/* Barra de Categorias Sticky (Hook de navegação) */}
      {!isLoading && !isError && categorias.length > 1 && (
        <nav className={styles.stickyNav} aria-label="Navegação por categorias">
          <div className={`container ${styles.stickyNavInner}`}>
            {categorias.map((cat) => {
              const count = cat === 'Todos' 
                ? (produtos?.length ?? 0)
                : (produtosPorCategoria[cat]?.length ?? 0)
              
              return (
                <button
                  key={cat}
                  className={`${styles.navPill} ${categoriaAtiva === cat ? styles.navPillActive : ''}`}
                  onClick={() => handleSelectCategoria(cat)}
                >
                  {cat === 'Pizzas' ? '🍕 ' : cat === 'Bebidas' ? '🥤 ' : ''}
                  {cat}
                  <span className={styles.pillCount}>{count}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* Conteúdo Principal */}
      <div className={`container ${styles.contentWrap}`}>
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
            <p className={styles.errorSub}>Verifique a conexão com a API.</p>
          </div>
        )}

        {!isLoading && !isError && totalFiltrados === 0 && (
          <div className={styles.empty}>
            <p>🍕 Nenhum item encontrado para "{busca}".</p>
            <button className={styles.clearFilterBtn} onClick={() => setBusca('')}>
              Ver todo o cardápio
            </button>
          </div>
        )}

        {!isLoading && !isError && totalFiltrados > 0 && (
          <>
            {busca && (
              <p className={styles.resultCount}>
                Encontrados <strong>{totalFiltrados}</strong> itens para "{busca}"
              </p>
            )}

            {Object.entries(produtosPorCategoria).map(([catNome, itens]) => {
              if (itens.length === 0) return null
              const slug = catNome.toLowerCase().replace(/[^a-z0-9]/g, '-')

              return (
                <section
                  key={catNome}
                  id={`secao-${slug}`}
                  className={styles.categoriaSection}
                >
                  <div className={styles.categoriaHeader}>
                    <h2 className={styles.categoriaTitle}>
                      {catNome === 'Pizzas' ? '🍕 ' : catNome === 'Bebidas' ? '🥤 ' : '🍽️ '}
                      {catNome}
                    </h2>
                    <span className={styles.categoriaBadge}>{itens.length} opções</span>
                  </div>

                  <div className={styles.grid}>
                    {itens.map((produto, i) => (
                      <PizzaCard
                        key={produto.id}
                        produto={produto}
                        index={i}
                        allProdutos={produtos ?? []}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>
    </section>
  )
}

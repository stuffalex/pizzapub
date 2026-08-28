import { useState } from 'react'
import { useCategorias, useCriarCategoria, useDeletarCategoria } from '@/hooks/useCategorias'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import styles from './CategoriasPage.module.css'

export function CategoriasPage() {
  const { data: categorias, isLoading } = useCategorias()
  const { mutate: criar } = useCriarCategoria()
  const { mutate: deletar } = useDeletarCategoria()

  const [nome, setNome] = useState('')

  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    criar({ nome }, {
      onSuccess: () => {
        toast.success('Categoria criada!')
        setNome('')
      },
      onError: () => toast.error('Erro ao criar categoria')
    })
  }

  const handleDeletar = (id: number) => {
    if (!confirm('Deseja mesmo remover esta categoria?')) return
    deletar(id, {
      onSuccess: () => toast.success('Categoria removida!'),
      onError: () => toast.error('Erro ao remover categoria')
    })
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Categorias</h1>
      </div>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleCriar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Nome da nova categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Button type="submit">Adicionar</Button>
        </form>

        {isLoading ? (
          <p>Carregando categorias...</p>
        ) : (
          <div className={styles.list}>
            {categorias?.map(cat => (
              <div key={cat.id} className={styles.listItem}>
                <span>{cat.nome}</span>
                <Button variant="danger" size="sm" onClick={() => handleDeletar(cat.id)}>
                  Remover
                </Button>
              </div>
            ))}
            {categorias?.length === 0 && <p>Nenhuma categoria cadastrada.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

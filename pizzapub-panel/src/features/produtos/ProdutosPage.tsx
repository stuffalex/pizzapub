import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { produtosService, CadastroProduto } from './produtos.service'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ProdutosPage.module.css'

export function ProdutosPage() {
  const queryClient = useQueryClient()
  
  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtosService.listarProdutos,
  })

  const { mutate: removerProduto } = useMutation({
    mutationFn: produtosService.removerProduto,
    onSuccess: () => {
      toast.success('Produto removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
    onError: () => {
      toast.error('Erro ao remover o produto.')
    }
  })

  // Simulação de formulário de novo produto in-line (poderia ser um modal)
  const [formOpen, setFormOpen] = useState(false)
  const [novoProduto, setNovoProduto] = useState<CadastroProduto>({ nome: '', descricao: '', preco: 0 })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { mutate: salvarProduto, isPending: isSaving } = useMutation({
    mutationFn: produtosService.cadastrarProduto,
    onSuccess: async (produtoSalvo) => {
      if (imagemFile) {
        setIsUploading(true)
        try {
          await produtosService.uploadImagem(produtoSalvo.id, imagemFile)
          toast.success('Produto e imagem cadastrados!')
        } catch (error) {
          toast.error('Produto cadastrado, mas falha no upload da imagem.')
        } finally {
          setIsUploading(false)
        }
      } else {
        toast.success('Produto cadastrado!')
      }
      setFormOpen(false)
      setNovoProduto({ nome: '', descricao: '', preco: 0 })
      setImagemFile(null)
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
    onError: () => {
      toast.error('Erro ao cadastrar produto.')
    }
  })

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    salvarProduto(novoProduto)
  }

  if (isLoading) return <div className={styles.loading}>Carregando cardápio...</div>

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestão do Cardápio</h1>
          <span className={styles.subtitle}>Gerencie as pizzas oferecidas</span>
        </div>
        <Button onClick={() => setFormOpen(!formOpen)}>
          <Plus size={18} /> Novo Produto
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleSalvar} className={styles.formCard}>
          <h3>Adicionar Nova Pizza</h3>
          <div className={styles.fields}>
            <input 
              type="text" 
              placeholder="Nome da pizza" 
              value={novoProduto.nome}
              onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})}
              required
              className={styles.input}
            />
            <input 
              type="number" 
              placeholder="Preço (R$)" 
              step="0.01"
              value={novoProduto.preco || ''}
              onChange={e => setNovoProduto({...novoProduto, preco: parseFloat(e.target.value)})}
              required
              className={styles.input}
            />
          </div>
          <textarea 
            placeholder="Ingredientes / Descrição"
            value={novoProduto.descricao}
            onChange={e => setNovoProduto({...novoProduto, descricao: e.target.value})}
            required
            className={styles.textarea}
          />
          <div className={styles.fileInputContainer}>
            <label>Imagem da Pizza (Opcional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setImagemFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={isSaving || isUploading}>Salvar Produto</Button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {produtos.map(p => (
          <div key={p.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{p.nome}</strong>
              <p className={styles.desc}>{p.descricao}</p>
            </div>
            <div className={styles.actions}>
              <span className={styles.price}>
                {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <button 
                className={styles.deleteBtn}
                onClick={() => {
                  if(confirm('Tem certeza que deseja apagar essa pizza?')) {
                    removerProduto(p.id)
                  }
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

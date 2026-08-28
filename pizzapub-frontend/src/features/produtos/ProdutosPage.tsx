import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { produtosService, CadastroProduto } from './produtos.service'
import { Produto } from '@/types/produto'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
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
    onError: () => toast.error('Erro ao remover o produto.')
  })

  const { mutate: toggleDisponivel } = useMutation({
    mutationFn: ({ id, disponivel }: { id: number; disponivel: boolean }) =>
      produtosService.atualizarDisponivel(id, disponivel),
    onSuccess: () => {
      toast.success('Disponibilidade atualizada!')
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
    onError: () => toast.error('Erro ao atualizar disponibilidade.')
  })

  const [formOpen, setFormOpen] = useState(false)
  const [novoProduto, setNovoProduto] = useState<CadastroProduto>({ nome: '', descricao: '', preco: 0 })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [variacoes, setVariacoes] = useState<{ nome: string; preco: string }[]>([])

  const { mutate: salvarProduto, isPending: isSaving } = useMutation({
    mutationFn: produtosService.cadastrarProduto,
    onSuccess: async (produtoSalvo: Produto) => {
      for (const v of variacoes) {
        if (v.nome && v.preco) {
          await produtosService.criarVariacao(produtoSalvo.id, v.nome, parseFloat(v.preco))
        }
      }
      if (imagemFile) {
        setIsUploading(true)
        try {
          await produtosService.uploadImagem(produtoSalvo.id, imagemFile)
          toast.success('Produto e imagem cadastrados!')
        } catch {
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
      setVariacoes([])
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
    onError: () => toast.error('Erro ao cadastrar produto.')
  })

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    salvarProduto(novoProduto)
  }

  const addVariacao = () => setVariacoes(v => [...v, { nome: '', preco: '' }])
  const removeVariacao = (i: number) => setVariacoes(v => v.filter((_, idx) => idx !== i))
  const updateVariacao = (i: number, field: 'nome' | 'preco', val: string) =>
    setVariacoes(v => v.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  if (isLoading) return <div className={styles.loading}>Carregando cardápio...</div>

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestão do Cardápio</h1>
          <span className={styles.subtitle}>Gerencie as pizzas, lanches e mais</span>
        </div>
        <Button onClick={() => setFormOpen(!formOpen)}>
          <Plus size={18} /> Novo Produto
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleSalvar} className={styles.formCard}>
          <h3>Adicionar Produto</h3>
          <div className={styles.fields}>
            <input 
              type="text" 
              placeholder="Nome do produto" 
              value={novoProduto.nome}
              onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})}
              required
              className={styles.input}
            />
            <input 
              type="number" 
              placeholder="Preço base (R$)" 
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

          <div className={styles.variacoesSection}>
            <div className={styles.variacoesHeader}>
              <span className={styles.variacoesTitle}>Tamanhos / Variações</span>
              <button type="button" className={styles.addVarBtn} onClick={addVariacao}>+ Adicionar</button>
            </div>
            {variacoes.map((v, i) => (
              <div key={i} className={styles.variacaoRow}>
                <input
                  placeholder="Nome (ex: P, M, G)"
                  value={v.nome}
                  onChange={e => updateVariacao(i, 'nome', e.target.value)}
                  className={styles.varInput}
                />
                <input
                  type="number"
                  placeholder="Preço (R$)"
                  step="0.01"
                  value={v.preco}
                  onChange={e => updateVariacao(i, 'preco', e.target.value)}
                  className={styles.varInput}
                />
                <button type="button" onClick={() => removeVariacao(i)} className={styles.removeVarBtn}>✕</button>
              </div>
            ))}
          </div>

          <div className={styles.fileInputContainer}>
            <label>Imagem do Produto (Opcional)</label>
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
          <div key={p.id} className={`${styles.item} ${!p.disponivel ? styles.unavailable : ''}`}>
            {p.urlImagem && (
              <img src={p.urlImagem} alt={p.nome} className={styles.thumb} />
            )}
            <div className={styles.info}>
              <strong>{p.nome}</strong>
              <p className={styles.desc}>{p.descricao}</p>
              {p.variacoes && p.variacoes.length > 0 && (
                <div className={styles.varTags}>
                  {p.variacoes.map(v => (
                    <span key={v.id} className={styles.varTag}>
                      {v.nome} — {v.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <span className={styles.price}>
                {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <button
                className={p.disponivel ? styles.toggleAvailableBtn : styles.toggleUnavailableBtn}
                onClick={() => toggleDisponivel({ id: p.id, disponivel: !p.disponivel })}
                title={p.disponivel ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
              >
                {p.disponivel ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button 
                className={styles.deleteBtn}
                onClick={() => {
                  if(confirm('Tem certeza que deseja apagar esse produto?')) {
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

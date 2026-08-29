import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { produtosService, CadastroProduto } from './produtos.service'
import { useCategorias } from '@/hooks/useCategorias'
import { Produto } from '@/types/produto'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ProdutosPage.module.css'

export function ProdutosPage() {
  const queryClient = useQueryClient()
  
  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtosService.listarProdutos,
  })

  const { data: categorias = [] } = useCategorias()

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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<CadastroProduto>({ nome: '', descricao: '', preco: 0, categoriaId: undefined })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [variacoes, setVariacoes] = useState<{ nome: string; preco: string }[]>([])

  const { mutate: salvarProduto, isPending: isSaving } = useMutation({
    mutationFn: async (dados: CadastroProduto) => {
      if (editingId) {
        return await produtosService.atualizarProduto(editingId, dados)
      } else {
        return await produtosService.cadastrarProduto(dados)
      }
    },
    onSuccess: async (produtoSalvo: Produto) => {
      // Salva novas variações se houver
      for (const v of variacoes) {
        if (v.nome && v.preco) {
          await produtosService.criarVariacao(produtoSalvo.id, v.nome, parseFloat(v.preco))
        }
      }
      if (imagemFile) {
        setIsUploading(true)
        try {
          await produtosService.uploadImagem(produtoSalvo.id, imagemFile)
          toast.success(editingId ? 'Produto e imagem atualizados!' : 'Produto e imagem cadastrados!')
        } catch {
          toast.error('Produto salvo, mas falha no upload da imagem.')
        } finally {
          setIsUploading(false)
        }
      } else {
        toast.success(editingId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')
      }
      fecharForm()
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
    onError: () => toast.error(editingId ? 'Erro ao atualizar produto.' : 'Erro ao cadastrar produto.')
  })

  const fecharForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setFormData({ nome: '', descricao: '', preco: 0, categoriaId: undefined })
    setImagemFile(null)
    setVariacoes([])
  }

  const handleEditar = (p: Produto) => {
    setEditingId(p.id)
    setFormData({
      nome: p.nome,
      descricao: p.descricao,
      preco: p.preco,
      categoriaId: p.categoria?.id
    })
    setImagemFile(null)
    setVariacoes([])
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    salvarProduto(formData)
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
          <span className={styles.subtitle}>Gerencie pizzas, bebidas e categorias</span>
        </div>
        {!formOpen && (
          <Button onClick={() => { fecharForm(); setFormOpen(true); }}>
            <Plus size={18} /> Novo Produto
          </Button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSalvar} className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h3>{editingId ? '✏️ Editar Produto' : '➕ Adicionar Novo Produto'}</h3>
            <button type="button" className={styles.closeFormBtn} onClick={fecharForm}>
              <X size={18} />
            </button>
          </div>

          <div className={styles.fields}>
            <div style={{ flex: 2 }}>
              <label className={styles.fieldLabel}>Nome do Produto *</label>
              <input 
                type="text" 
                placeholder="Ex: Pizza Quatro Queijos, Coca-Cola..." 
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                required
                className={styles.input}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label className={styles.fieldLabel}>Preço (R$) *</label>
              <input 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={formData.preco || ''}
                onChange={e => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                required
                className={styles.input}
              />
            </div>

            <div style={{ flex: 1.5 }}>
              <label className={styles.fieldLabel}>Categoria</label>
              <select
                className={styles.select}
                value={formData.categoriaId ?? ''}
                onChange={e => setFormData({ ...formData, categoriaId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={styles.fieldLabel}>Ingredientes / Descrição *</label>
            <textarea 
              placeholder="Descreva os ingredientes, tamanho da embalagem ou detalhes..."
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              required
              className={styles.textarea}
            />
          </div>

          {!editingId && (
            <div className={styles.variacoesSection}>
              <div className={styles.variacoesHeader}>
                <span className={styles.variacoesTitle}>Tamanhos / Variações (Opcional)</span>
                <button type="button" className={styles.addVarBtn} onClick={addVariacao}>+ Adicionar</button>
              </div>
              {variacoes.map((v, i) => (
                <div key={i} className={styles.variacaoRow}>
                  <input
                    placeholder="Nome (ex: P, M, G, 2 Litros)"
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
          )}

          <div className={styles.fileInputContainer}>
            <label className={styles.fieldLabel}>Foto do Produto {editingId && '(deixe em branco para manter a atual)'}</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setImagemFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={fecharForm}>Cancelar</Button>
            <Button type="submit" loading={isSaving || isUploading}>
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <strong>{p.nome}</strong>
                {p.categoria?.nome && (
                  <span className={styles.categoryBadge}>{p.categoria.nome}</span>
                )}
              </div>
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
                className={styles.editBtn}
                onClick={() => handleEditar(p)}
                title="Editar Produto"
              >
                <Pencil size={18} />
              </button>

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
                  if(confirm(`Tem certeza que deseja apagar "${p.nome}"?`)) {
                    removerProduto(p.id)
                  }
                }}
                title="Excluir Produto"
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

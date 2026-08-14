import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart.store'
import { checkoutService } from './checkout.service'
import { Button } from '@/components/ui/Button'
import styles from './CheckoutPage.module.css'

function cpfMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

function telMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .slice(0, 15)
}

interface FormData {
  cpf: string
  nome: string
  telefone: string
  email: string
  endereco: string
  observacoes: string
}

interface FormErrors {
  cpf?: string
  nome?: string
  endereco?: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    cpf: '',
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const cpfId = useId()
  const nomeId = useId()
  const telId = useId()
  const emailId = useId()
  const endId = useId()
  const obsId = useId()

  function validate(): boolean {
    const newErrors: FormErrors = {}
    const cpfClean = form.cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) newErrors.cpf = 'CPF inválido (11 dígitos)'
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!form.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError(null)

    try {
      const pedido = {
        cpfCliente: form.cpf.replace(/\D/g, ''),
        enderecoEntrega: form.endereco.trim(),
        observacao: form.observacoes.trim() || undefined,
        itens: items.map((item) => ({
          tipo: item.sabores.length === 1 ? 'INTEIRA' : 'MEIO_A_MEIO',
          produtoIds: item.sabores.map((s) => s.id),
          quantidade: item.quantidade,
          observacao: item.observacao || undefined,
        })),
      }

      const response = await checkoutService.criarPedido(pedido)
      clear()
      navigate(`/confirmacao/${response.id}`)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setServerError(
        axiosErr.response?.data?.message ?? 'Erro ao enviar pedido. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione pizzas antes de finalizar o pedido.</p>
        <Button id="voltar-cardapio" onClick={() => navigate('/')}>
          Ver Cardápio
        </Button>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.grid}>
        {/* Formulário */}
        <section className={styles.formSection}>
          <h1 className={styles.title}>Finalizar Pedido</h1>

          {serverError && (
            <div className={styles.errorAlert} role="alert">{serverError}</div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor={cpfId} className={styles.label}>CPF *</label>
              <input
                id={cpfId}
                type="text"
                className={`${styles.input} ${errors.cpf ? styles.inputError : ''}`}
                placeholder="000.000.000-00"
                value={form.cpf}
                inputMode="numeric"
                onChange={(e) => setForm({ ...form, cpf: cpfMask(e.target.value) })}
              />
              {errors.cpf && <span className={styles.errorMsg}>{errors.cpf}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={nomeId} className={styles.label}>Nome *</label>
              <input
                id={nomeId}
                type="text"
                className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              {errors.nome && <span className={styles.errorMsg}>{errors.nome}</span>}
            </div>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor={telId} className={styles.label}>Telefone</label>
                <input
                  id={telId}
                  type="tel"
                  className={styles.input}
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: telMask(e.target.value) })}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor={emailId} className={styles.label}>E-mail</label>
                <input
                  id={emailId}
                  type="email"
                  className={styles.input}
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={endId} className={styles.label}>Endereço de entrega *</label>
              <input
                id={endId}
                type="text"
                className={`${styles.input} ${errors.endereco ? styles.inputError : ''}`}
                placeholder="Rua, número, bairro, cidade"
                value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              />
              {errors.endereco && <span className={styles.errorMsg}>{errors.endereco}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={obsId} className={styles.label}>Observações gerais</label>
              <textarea
                id={obsId}
                className={styles.textarea}
                placeholder="Ex: portão azul, apartamento 12..."
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                rows={3}
              />
            </div>
          </form>
        </section>

        {/* Resumo */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumo</h2>
          <ul className={styles.summaryList}>
            {items.map((item) => (
              <li key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryNome}>
                  {item.quantidade}x {item.sabores.map((s) => s.nome).join(' + ')}
                </span>
                <span className={styles.summaryPreco}>
                  {(item.precoUnitario * item.quantidade).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <strong>
              {total().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </strong>
          </div>

          <Button
            id="submit-pedido"
            type="submit"
            form="checkout-form"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            🍕 Confirmar Pedido
          </Button>

          <button className={styles.voltarBtn} onClick={() => navigate('/')}>
            ← Voltar ao Cardápio
          </button>
        </aside>
      </div>
    </div>
  )
}

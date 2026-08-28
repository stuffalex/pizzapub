import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import api from '@/core/api/api'
import styles from './MeusPedidosPage.module.css'

interface Pedido {
  id: number
  codigoRastreio: string
  status: string
  total: number
}

const statusMap: Record<string, { label: string, color: string }> = {
  RECEBIDO: { label: 'Recebido', color: '#3498db' },
  PREPARANDO: { label: 'Preparando', color: '#f39c12' },
  A_CAMINHO: { label: 'A Caminho', color: '#9b59b6' },
  ENTREGUE: { label: 'Entregue', color: '#2ecc71' },
  CANCELADO: { label: 'Cancelado', color: '#e74c3c' }
}

export function MeusPedidosPage() {
  const navigate = useNavigate()
  const [cpf, setCpf] = useState('')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const savedCpf = localStorage.getItem('@pizzapub/cpf')
    if (savedCpf) {
      setCpf(savedCpf)
      buscarPedidos(savedCpf)
    }
  }, [])

  const buscarPedidos = async (cpfBusca: string) => {
    if (!cpfBusca) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get(`/api/pedidos/cliente/${cpfBusca}`)
      setPedidos(data)
      localStorage.setItem('@pizzapub/cpf', cpfBusca)
    } catch (error) {
      console.error('Erro ao buscar pedidos', error)
      setPedidos([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    buscarPedidos(cpf)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Meus Pedidos</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Digite seu CPF"
            className={styles.input}
            value={cpf}
            onChange={e => setCpf(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>

        {searched && !loading && pedidos.length === 0 && (
          <p className={styles.empty}>Nenhum pedido encontrado para este CPF.</p>
        )}

        <div className={styles.list}>
          {pedidos.map(pedido => {
            const statusInfo = statusMap[pedido.status] || { label: pedido.status, color: '#333' }
            return (
              <div key={pedido.id} className={styles.pedidoCard}>
                <div className={styles.pedidoHeader}>
                  <span className={styles.pedidoId}>Pedido #{pedido.id}</span>
                  <span 
                    className={styles.pedidoStatus}
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className={styles.pedidoFooter}>
                  <span>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}</span>
                  <Button size="sm" onClick={() => navigate(`/acompanhar/${pedido.codigoRastreio}`)}>
                    Acompanhar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import api from '@/core/api/api'
import styles from './AcompanhamentoPage.module.css'

interface PedidoRastreio {
  id: number
  codigoRastreio: string
  status: 'RECEBIDO' | 'PREPARANDO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO'
  total: number
}

const statusMap = {
  RECEBIDO: { label: 'Recebido', icon: '📝', color: '#3498db' },
  PREPARANDO: { label: 'Preparando', icon: '👨‍🍳', color: '#f39c12' },
  A_CAMINHO: { label: 'A Caminho', icon: '🛵', color: '#9b59b6' },
  ENTREGUE: { label: 'Entregue', icon: '✅', color: '#2ecc71' },
  CANCELADO: { label: 'Cancelado', icon: '❌', color: '#e74c3c' }
}

export function AcompanhamentoPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<PedidoRastreio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedido() {
      try {
        const { data } = await api.get(`/api/pedidos/rastreio/${codigo}`)
        setPedido(data)
      } catch (error) {
        console.error('Erro ao buscar pedido', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPedido()
    // Atualiza a cada 10 segundos
    const interval = setInterval(fetchPedido, 10000)
    return () => clearInterval(interval)
  }, [codigo])

  if (loading) {
    return <div className={styles.loading}>Buscando pedido...</div>
  }

  if (!pedido) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2>Pedido não encontrado</h2>
          <p>O código de rastreio informado é inválido.</p>
          <Button onClick={() => navigate('/')}>Voltar ao Menu</Button>
        </div>
      </div>
    )
  }

  const currentStatusInfo = statusMap[pedido.status]

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Acompanhamento do Pedido #{pedido.id}</h1>
        
        <div className={styles.statusBadge} style={{ backgroundColor: currentStatusInfo.color }}>
          <span className={styles.icon}>{currentStatusInfo.icon}</span>
          <span className={styles.statusLabel}>{currentStatusInfo.label}</span>
        </div>

        <div className={styles.progressTrack}>
          {['RECEBIDO', 'PREPARANDO', 'A_CAMINHO', 'ENTREGUE'].map((s, index) => {
            const isActive = Object.keys(statusMap).indexOf(pedido.status) >= index
            const isCancelled = pedido.status === 'CANCELADO'
            if (isCancelled && index > 0) return null
            
            return (
              <div key={s} className={`${styles.progressStep} ${isActive ? styles.active : ''}`}>
                <div className={styles.stepDot}></div>
                <span className={styles.stepLabel}>{statusMap[s as keyof typeof statusMap].label}</span>
              </div>
            )
          })}
        </div>

        <Button size="lg" onClick={() => navigate('/')} style={{ width: '100%', marginTop: '2rem' }}>
          Voltar ao Cardápio
        </Button>
      </div>
    </div>
  )
}

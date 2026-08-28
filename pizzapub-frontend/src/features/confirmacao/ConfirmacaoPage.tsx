import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import api from '@/core/api/api'
import styles from './ConfirmacaoPage.module.css'

interface PedidoResponse {
  id: number
  codigoRastreio: string
}

export function ConfirmacaoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<PedidoResponse | null>(null)

  useEffect(() => {
    async function fetchPedido() {
      try {
        const { data } = await api.get(`/api/pedidos/${id}`)
        setPedido(data)
      } catch (error) {
        console.error('Erro ao buscar pedido', error)
      }
    }
    fetchPedido()
  }, [id])

  const wppText = pedido 
    ? `Olá, acabei de fazer o pedido #${pedido.id} pelo cardápio online! %0A%0A*Acompanhe em:* %0Ahttp://localhost:5174/acompanhar/${pedido.codigoRastreio}` 
    : ''

  const wppLink = `https://wa.me/551133334444?text=${wppText}`

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.checkIcon}>✓</span>
        </div>
        <h1 className={styles.title}>Pedido Confirmado!</h1>
        <p className={styles.sub}>
          Seu pedido <strong>#{id}</strong> foi recebido com sucesso. Aguarde — estamos preparando sua pizza com muito carinho! 🍕
        </p>

        <div className={styles.infoBox}>
          <p>⏱️ Tempo estimado de entrega: <strong>40–60 min</strong></p>
          <p>📞 Qualquer dúvida, ligue para: <strong>(11) 3333-4444</strong></p>
        </div>

        {pedido && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <Button
              size="lg"
              onClick={() => navigate(`/acompanhar/${pedido.codigoRastreio}`)}
              style={{ width: '100%', backgroundColor: '#f39c12', borderColor: '#f39c12' }}
            >
              📍 Acompanhar Pedido
            </Button>

            <a href={wppLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button
                size="lg"
                style={{ width: '100%', backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                💬 Enviar para o WhatsApp
              </Button>
            </a>
          </div>
        )}

        <Button
          id="voltar-cardapio-confirmacao"
          size="lg"
          onClick={() => navigate('/')}
          style={{ width: '100%', marginTop: '1rem' }}
          variant="secondary"
        >
          Fazer Novo Pedido
        </Button>
      </div>
    </div>
  )
}

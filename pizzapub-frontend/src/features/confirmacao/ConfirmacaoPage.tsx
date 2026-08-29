import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const statePedido = (location.state as { pedido?: PedidoResponse })?.pedido
  const [pedido, setPedido] = useState<PedidoResponse | null>(statePedido || null)

  useEffect(() => {
    if (statePedido) return

    async function fetchPedido() {
      if (!id) return
      try {
        // Se for um UUID de rastreio (contém hífen ou tamanho >= 20), busca na rota pública de rastreio
        const isTrackingCode = id.includes('-') || id.length > 20
        const endpoint = isTrackingCode ? `/api/pedidos/rastreio/${id}` : `/api/pedidos/${id}`
        
        const { data } = await api.get(endpoint)
        setPedido(data)
      } catch (error) {
        console.warn('Não foi possível carregar detalhes adicionais do pedido:', error)
      }
    }
    fetchPedido()
  }, [id, statePedido])

  const numeroExibicao = pedido?.id ?? id ?? ''
  const codigoRastreio = pedido?.codigoRastreio || (id?.includes('-') ? id : '')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const wppText = codigoRastreio
    ? encodeURIComponent(
        `Olá, acabei de fazer o pedido #${numeroExibicao} pelo cardápio online!\n\n*Acompanhe em:*\n${origin}/acompanhar/${codigoRastreio}`
      )
    : encodeURIComponent(`Olá, acabei de fazer o pedido #${numeroExibicao} pelo cardápio online!`)

  const wppLink = `https://wa.me/551133334444?text=${wppText}`

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.checkIcon}>✓</span>
        </div>
        <h1 className={styles.title}>Pedido Confirmado!</h1>
        <p className={styles.sub}>
          Seu pedido <strong>#{numeroExibicao}</strong> foi recebido com sucesso. Aguarde — estamos preparando sua pizza com muito carinho! 🍕
        </p>

        <div className={styles.infoBox}>
          <p>⏱️ Tempo estimado de entrega: <strong>40–60 min</strong></p>
          <p>📞 Qualquer dúvida, ligue para: <strong>(11) 3333-4444</strong></p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {codigoRastreio ? (
            <Button
              size="lg"
              onClick={() => navigate(`/acompanhar/${codigoRastreio}`)}
              style={{ width: '100%', backgroundColor: '#f39c12', borderColor: '#f39c12' }}
            >
              📍 Acompanhar Pedido
            </Button>
          ) : null}

          <a href={wppLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button
              size="lg"
              style={{ width: '100%', backgroundColor: '#25D366', borderColor: '#25D366' }}
            >
              💬 Enviar para o WhatsApp
            </Button>
          </a>
        </div>

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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pedidosService } from './pedidos.service'
import { PedidoResponse, StatusPedido } from '@/types/pedido'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'
import styles from './PedidosPage.module.css'

const STATUS_FLOW: StatusPedido[] = ['RECEBIDO', 'PREPARANDO', 'A_CAMINHO', 'ENTREGUE']

const STATUS_LABELS: Record<StatusPedido, string> = {
  RECEBIDO: '📝 Recebido',
  PREPARANDO: '👨‍🍳 Preparando',
  A_CAMINHO: '🛵 A Caminho',
  ENTREGUE: '✅ Entregue',
  CANCELADO: '❌ Cancelado',
}

const STATUS_COLORS: Record<StatusPedido, string> = {
  RECEBIDO: '#3498db',
  PREPARANDO: '#f39c12',
  A_CAMINHO: '#9b59b6',
  ENTREGUE: '#2ecc71',
  CANCELADO: '#e74c3c',
}

function getNextStatus(current: StatusPedido): StatusPedido | null {
  const idx = STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[idx + 1]
}

function groupByStatus(pedidos: PedidoResponse[]): Record<StatusPedido, PedidoResponse[]> {
  const groups: Record<StatusPedido, PedidoResponse[]> = {
    RECEBIDO: [], PREPARANDO: [], A_CAMINHO: [], ENTREGUE: [], CANCELADO: []
  }
  for (const p of pedidos) {
    groups[p.status]?.push(p)
  }
  return groups
}

const KANBAN_COLUMNS: StatusPedido[] = ['RECEBIDO', 'PREPARANDO', 'A_CAMINHO', 'ENTREGUE']

export function PedidosPage() {
  const queryClient = useQueryClient()

  const { data: pedidos = [], isLoading, isError, error } = useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.listarPedidos,
    refetchInterval: 10000, // polling a cada 10s
  })

  const { mutate: atualizarStatus, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusPedido }) =>
      pedidosService.atualizarStatus(id, status),
    onSuccess: () => {
      toast.success('Status atualizado!')
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    },
    onError: () => toast.error('Erro ao atualizar status.'),
  })

  const { mutate: cancelar } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      pedidosService.atualizarStatus(id, 'CANCELADO'),
    onSuccess: () => {
      toast.success('Pedido cancelado.')
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    },
    onError: () => toast.error('Erro ao cancelar pedido.'),
  })

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>Carregando pedidos em tempo real...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.errorBox}>
        <h3>Erro ao buscar pedidos</h3>
        <p>{error instanceof Error ? error.message : 'Falha na conexão'}</p>
        <p className={styles.help}>Verifique se o backend está rodando e se você tem permissão (perfil Atendente/Admin).</p>
      </div>
    )
  }

  const grouped = groupByStatus(pedidos)

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard de Pedidos — Kanban</h1>
        <span className={styles.subtitle}>
          Atualização automática a cada 10s — {pedidos.filter(p => p.status !== 'ENTREGUE' && p.status !== 'CANCELADO').length} ativos
        </span>
      </div>

      {pedidos.length === 0 ? (
        <div className={styles.empty}>
          <p>🍕 Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        <div className={styles.kanban}>
          {KANBAN_COLUMNS.map((colStatus) => (
            <div key={colStatus} className={styles.kanbanCol}>
              <div className={styles.kanbanColHeader} style={{ borderColor: STATUS_COLORS[colStatus] }}>
                <span>{STATUS_LABELS[colStatus]}</span>
                <span className={styles.colCount}>{grouped[colStatus].length}</span>
              </div>

              <div className={styles.kanbanCards}>
                {grouped[colStatus].length === 0 && (
                  <div className={styles.emptyCol}>Nenhum pedido</div>
                )}
                {grouped[colStatus].map((pedido) => {
                  const next = getNextStatus(pedido.status)
                  return (
                    <div key={pedido.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <span className={styles.pedidoId}>#{pedido.id}</span>
                        <span className={styles.tempo}>
                          {pedido.dataCriacao
                            ? format(new Date(pedido.dataCriacao), 'HH:mm', { locale: ptBR })
                            : '—'}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p className={styles.clienteNome}>
                          <strong>Cliente:</strong> {pedido.cliente?.nome || 'Não identificado'}
                          <span className={styles.cpf}> ({pedido.cliente?.cpf || 'S/ CPF'})</span>
                        </p>

                        <div className={styles.itensWrap}>
                          <p className={styles.itensTitle}>Itens:</p>
                          <ul className={styles.itensList}>
                            {pedido.itens?.map((item, idx) => (
                              <li key={idx}>
                                {item.quantidade}x {item.sabores?.join(' + ')}
                                {item.variacao && <span className={styles.variacao}> [{item.variacao}]</span>}
                                {item.observacao && <span className={styles.obs}> (Obs: {item.observacao})</span>}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {pedido.observacao && (
                          <div className={styles.obsGeral}>
                            <strong>Obs do Pedido:</strong> {pedido.observacao}
                          </div>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <span className={styles.valorTotal}>
                          {pedido.valorTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
                        </span>
                        <div className={styles.footerActions}>
                          {next && (
                            <button
                              className={styles.actionBtn}
                              disabled={isPending}
                              onClick={() => atualizarStatus({ id: pedido.id, status: next })}
                            >
                              → {STATUS_LABELS[next].split(' ')[1] || STATUS_LABELS[next]}
                            </button>
                          )}
                          {pedido.status !== 'CANCELADO' && pedido.status !== 'ENTREGUE' && (
                            <button
                              className={styles.cancelBtn}
                              onClick={() => {
                                if (confirm(`Cancelar pedido #${pedido.id}?`)) cancelar({ id: pedido.id })
                              }}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

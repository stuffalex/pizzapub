import { useQuery } from '@tanstack/react-query'
import { pedidosService } from './pedidos.service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import styles from './PedidosPage.module.css'

export function PedidosPage() {
  const { data: pedidos = [], isLoading, isError, error } = useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.listarPedidos,
    refetchInterval: 15000, // polling a cada 15s para simular tempo real
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

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard de Pedidos</h1>
        <span className={styles.subtitle}>
          Monitoramento em tempo real — {pedidos.length} pedidos hoje
        </span>
      </div>

      {pedidos.length === 0 ? (
        <div className={styles.empty}>
          <p>🍕 Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* Kanban simplificado / Lista de Cards */}
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.pedidoId}>#{pedido.id}</span>
                <span className={styles.tempo}>
                  {format(new Date(), 'HH:mm', { locale: ptBR })} {/* Data fake para compilar caso não tenha no payload */}
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
                        {item.quantidade}x {item.sabores?.map(s => s.nome).join(' + ')}
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
                <button className={styles.actionBtn}>Avançar Status</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

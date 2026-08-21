package br.com.pizzapub.service;

import br.com.pizzapub.domain.Cliente;
import br.com.pizzapub.domain.Endereco;
import br.com.pizzapub.domain.ItemPedido;
import br.com.pizzapub.domain.Pedido;
import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.repository.ClienteRepository;
import br.com.pizzapub.repository.PedidoRepository;
import br.com.pizzapub.repository.ProdutoRepository;
import br.com.pizzapub.repository.VariacaoRepository;
import br.com.pizzapub.dtos.ItemPedidoDTO;
import br.com.pizzapub.dtos.PedidoDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço responsável pela lógica de negócio relacionada a pedidos.
 *
 * <p>Orquestra a criação de pedidos: busca ou cria o cliente pelo CPF,
 * monta os itens com seus sabores e aplica as regras de precificação.</p>
 *
 * @see br.com.pizzapub.controller.PedidoController
 * @see br.com.pizzapub.domain.Pedido
 */
@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Cria e persiste um novo pedido a partir dos dados do DTO recebido.
     *
     * <p>Fluxo:
     * <ol>
     *   <li>Busca o cliente pelo CPF; se não existir, cria um novo cadastro.</li>
     *   <li>Monta cada {@link br.com.pizzapub.domain.ItemPedido} com seus sabores e preço.</li>
     *   <li>Salva o pedido de forma atômica via {@code @Transactional}.</li>
     * </ol>
     * </p>
     *
     * @param dto Dados do pedido recebidos da requisição HTTP
     * @return O {@link br.com.pizzapub.domain.Pedido} persistido com ID gerado
     * @throws RuntimeException se algum dos sabores informados não for encontrado
     */
    @Transactional // Fundamental para garantir que ou salva tudo ou nada
    public Pedido salvarPedido(PedidoDTO dto) {
        Cliente cliente = clienteRepository.findByCpf(dto.cpfCliente())
                .orElseGet(() -> {
                    Cliente novo = new Cliente();
                    novo.setCpf(dto.cpfCliente());
                    novo.setEndereco(new Endereco());
                    // Aqui você poderia setar outros dados vindo do DTO se quiser
                    return clienteRepository.save(novo);
                });

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);

        List<ItemPedido> itens = dto.itens().stream().map(
                        itemDto -> criarItem(itemDto, pedido))
                .toList();

        pedido.setItemPedidoList(itens);

        return pedidoRepository.save(pedido);
    }

    /**
     * Monta um {@link br.com.pizzapub.domain.ItemPedido} a partir do DTO do item.
     *
     * <p><strong>Regra de preço (meio a meio)</strong>: O {@code precoUnitario} do item
     * é definido como o <em>maior preço</em> entre todos os sabores escolhidos.
     * Isso reflete a prática padrão do mercado para pizzas com múltiplos sabores.</p>
     *
     * @param itemDto DTO com IDs dos sabores, quantidade e observação
     * @param pedido  O pedido pai ao qual este item será associado
     * @return O {@link br.com.pizzapub.domain.ItemPedido} montado (ainda não persistido)
     * @throws RuntimeException se nenhum sabor for encontrado para os IDs fornecidos
     */
    @Autowired
    private VariacaoRepository variacaoRepository;

    private ItemPedido criarItem(ItemPedidoDTO itemDto, Pedido pedido) {
        List<Produto> sabores = produtoRepository.findAllById(itemDto.produtoIds());

        if (sabores.isEmpty()) {
            throw new RuntimeException("Sabores não encontrados");
        }

        ItemPedido item = new ItemPedido();
        item.setPedido(pedido);
        item.setSabores(sabores);
        item.setQuantidade(itemDto.quantidade());
        item.setObservacao(itemDto.observacao());

        if (itemDto.variacaoId() != null) {
            br.com.pizzapub.domain.Variacao variacao = variacaoRepository.findById(itemDto.variacaoId())
                    .orElseThrow(() -> new RuntimeException("Variação não encontrada"));
            item.setVariacao(variacao);
            item.setPrecoUnitario(variacao.getPreco());
        } else {
            // Fallback para maior preço se não houver variação (legado)
            BigDecimal maiorPreco = sabores.stream()
                    .map(Produto::getPreco)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
            item.setPrecoUnitario(maiorPreco);
        }

        return item;
    }

    /**
     * Busca um pedido pelo seu ID.
     *
     * @param id ID do pedido
     * @return O pedido encontrado, ou {@code null} se não existir
     */
    public Pedido buscarPedidoPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public Pedido buscarPorCodigoRastreio(java.util.UUID codigo) {
        return pedidoRepository.findByCodigoRastreio(codigo).orElse(null);
    }

    /**
     * Lista todos os pedidos cadastrados.
     * @return Lista de pedidos
     */
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> buscarPorCpf(String cpf) {
        return pedidoRepository.findByClienteCpf(cpf);
    }

    @Transactional
    public Pedido atualizarStatus(Long id, br.com.pizzapub.domain.StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }
}
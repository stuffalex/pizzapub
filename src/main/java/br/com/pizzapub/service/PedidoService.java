package br.com.pizzapub.service;

import br.com.pizzapub.domain.Cliente;
import br.com.pizzapub.domain.ItemPedido;
import br.com.pizzapub.domain.Pedido;
import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.repository.ClienteRepository;
import br.com.pizzapub.repository.PedidoRepository;
import br.com.pizzapub.repository.ProdutoRepository;
import br.com.pizzapub.dtos.ItemPedidoDTO;
import br.com.pizzapub.dtos.PedidoDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional // Fundamental para garantir que ou salva tudo ou nada
    public Pedido salvarPedido(PedidoDTO dto) {
        Cliente cliente = clienteRepository.findByCpf(dto.cpfCliente())
                .orElseGet(() -> {
                    Cliente novo = new Cliente();
                    novo.setCpf(dto.cpfCliente());
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

        // Regra de Negócio: Preço da pizza é o valor da mais cara entre os sabores
        BigDecimal maiorPreco = sabores.stream()
                .map(Produto::getPreco)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

//        BigDecimal mediaPreco = sabores.stream()
//                .map(Produto::getPreco)
//                .reduce(BigDecimal.ZERO, BigDecimal::add)
//                .divide(BigDecimal.valueOf(sabores.size()), MathContext.DECIMAL32);

        item.setPrecoUnitario(maiorPreco);

        return item;
    }

    public Pedido buscarPedidoPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }
}
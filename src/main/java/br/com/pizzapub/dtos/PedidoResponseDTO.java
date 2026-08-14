package br.com.pizzapub.dtos;

import br.com.pizzapub.domain.Pedido;
import br.com.pizzapub.domain.StatusPedido;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record PedidoResponseDTO(
        Long id,
        Long clienteId,
        List<ItemPedidoResponseDTO> itens,
        BigDecimal total,
        UUID codigoRastreio,
        StatusPedido status
) {
    public static PedidoResponseDTO from(Pedido pedido) {
        BigDecimal total = pedido.getItemPedidoList().stream()
                .map(item -> item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getCliente() != null ? pedido.getCliente().getId() : null,
                pedido.getItemPedidoList().stream().map(ItemPedidoResponseDTO::from).collect(Collectors.toList()),
                total,
                pedido.getCodigoRastreio(),
                pedido.getStatus()
        );
    }
}

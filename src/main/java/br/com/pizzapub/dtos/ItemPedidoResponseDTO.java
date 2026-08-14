package br.com.pizzapub.dtos;

import br.com.pizzapub.domain.ItemPedido;
import br.com.pizzapub.domain.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record ItemPedidoResponseDTO(
        Long id,
        Integer quantidade,
        BigDecimal precoUnitario,
        String observacao,
        List<String> sabores
) {
    public static ItemPedidoResponseDTO from(ItemPedido item) {
        return new ItemPedidoResponseDTO(
                item.getId(),
                item.getQuantidade(),
                item.getPrecoUnitario(),
                item.getObservacao(),
                item.getSabores().stream().map(Produto::getNome).collect(Collectors.toList())
        );
    }
}

package br.com.pizzapub.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record PedidoDTO(
        @Schema(example = "89986337011", description = "CPF do cliente")
        String cpfCliente,
        @Schema(description = "Lista de IDs dos sabores")
        List<ItemPedidoDTO> itens,
        @Schema(example = "Rua Exemplo, 123", description = "Endereço de entrega do pedido")
        String enderecoEntrega,
        @Schema(example = "Sem cebola", description = "Observações adicionais para o pedido")
        String observacao
) {}
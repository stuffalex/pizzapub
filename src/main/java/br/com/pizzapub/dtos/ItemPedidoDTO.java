package br.com.pizzapub.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record ItemPedidoDTO(
        @Schema(example = "INTEIRA", description = "Tipo da pizza")
        String tipo,
        @Schema(example = "[1, 2]", description = "Lista de IDs dos sabores")
        List<Long> produtoIds,
        @Schema(example = "1")
        int quantidade,
        @Schema(example = "Sem cebola", description = "Observações adicionais sobre o item")
        String observacao)
 {
}

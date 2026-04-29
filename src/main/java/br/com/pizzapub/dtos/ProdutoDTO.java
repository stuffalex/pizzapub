package br.com.pizzapub.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public record ProdutoDTO(
        @Schema(example = "1", description = "ID do produto")
        Long idProduto,
        @Schema(example = "50.00", description = "Preço do produto")
        String preco) {
}


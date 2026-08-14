package br.com.pizzapub.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CadastroProdutoDTO(
        @Schema(example = "Calabresa")
        @NotBlank String nome,
        @Schema(example = "Pizza de calabresa com queijo e cebola")
        @NotBlank String descricao,
        @Schema(example = "50.00")
        @NotBlank String preco,
        @Schema(example = "1")
        Long categoriaId) {
}

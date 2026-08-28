package br.com.pizzapub.dtos.auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO de resposta para os endpoints de autenticação ({@code login} e {@code register}).
 *
 * <p>Contém o token JWT e metadados do usuário autenticado.
 * O campo {@code tipo} sempre retorna {@code "Bearer"}, indicando o esquema de autenticação.</p>
 *
 * @param token  Token JWT gerado, válido por 24h (configurável em {@code jwt.expiration})
 * @param tipo   Tipo do token — sempre {@code "Bearer"}
 * @param nome   Nome de exibição do usuário autenticado
 * @param perfil Perfil do usuário: {@code CLIENTE}, {@code ATENDENTE} ou {@code ADMIN}
 */
@Schema(description = "Resposta de autenticação com token JWT")
public record LoginResponseDTO(

        @Schema(description = "Token JWT para uso no header Authorization: Bearer <token>")
        String token,

        @Schema(example = "Bearer")
        String tipo,

        @Schema(example = "Administrador PizzaPub")
        String nome,

        @Schema(example = "ADMIN", description = "Perfil de acesso do usuário")
        String perfil
) {}

package br.com.pizzapub.dtos.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO de entrada para o endpoint de login ({@code POST /api/auth/login}).
 *
 * @param email Email cadastrado do usuário
 * @param senha Senha em texto puro (será validada contra o hash BCrypt armazenado)
 */
@Schema(description = "Credenciais para autenticação")
public record LoginRequestDTO(

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Formato de email inválido")
        @Schema(example = "admin@pizzapub.com", description = "Email do usuário")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Schema(example = "admin123", description = "Senha do usuário")
        String senha
) {}

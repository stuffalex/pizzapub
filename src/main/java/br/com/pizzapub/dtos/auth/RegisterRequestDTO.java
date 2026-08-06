package br.com.pizzapub.dtos.auth;

import br.com.pizzapub.domain.PerfilUsuario;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para o endpoint de registro ({@code POST /api/auth/register}).
 *
 * <p><strong>Acesso restrito a {@code ADMIN}</strong> — este endpoint requer
 * autenticação com token JWT de perfil ADMIN.</p>
 *
 * @param nome   Nome completo do novo usuário
 * @param email  Email único do novo usuário (usado como login)
 * @param senha  Senha em texto puro — será hasheada com BCrypt antes de persistir
 * @param perfil Perfil de acesso desejado; se omitido, padrão é {@code ATENDENTE}
 */
@Schema(description = "Dados para registro de novo usuário (requer perfil ADMIN)")
public record RegisterRequestDTO(

        @NotBlank(message = "O nome é obrigatório")
        @Schema(example = "João Silva", description = "Nome completo do usuário")
        String nome,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Formato de email inválido")
        @Schema(example = "joao@pizzapub.com", description = "Email único para login")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        @Schema(example = "senha123", description = "Senha (mínimo 6 caracteres)")
        String senha,

        @Schema(example = "ATENDENTE", description = "Perfil de acesso. Padrão: ATENDENTE se omitido")
        PerfilUsuario perfil
) {}

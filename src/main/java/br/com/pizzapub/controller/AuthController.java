package br.com.pizzapub.controller;

import br.com.pizzapub.dtos.auth.LoginRequestDTO;
import br.com.pizzapub.dtos.auth.LoginResponseDTO;
import br.com.pizzapub.dtos.auth.RegisterRequestDTO;
import br.com.pizzapub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST para os endpoints de autenticação ({@code /api/auth}).
 *
 * <ul>
 *   <li>{@code POST /api/auth/login} — público, retorna JWT</li>
 *   <li>{@code POST /api/auth/register} — restrito a {@code ADMIN}, cria novo usuário</li>
 * </ul>
 *
 * @see AuthService
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoints de login e registro de usuários")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Autentica um usuário existente com email e senha.
     *
     * <p>Em caso de sucesso, retorna um token JWT válido por 24h que deve ser
     * enviado nos headers das requisições protegidas como:
     * {@code Authorization: Bearer <token>}</p>
     *
     * @param dto Credenciais de login (email + senha)
     * @return {@code 200 OK} com token JWT e dados do usuário
     */
    @PostMapping("/login")
    @Operation(
            summary = "Login",
            description = "Autentica com email e senha. Retorna token JWT para uso nos endpoints protegidos.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Autenticado com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
                    @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos")
            }
    )
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * <p><strong>Acesso restrito a {@code ADMIN}</strong> — requer token JWT de perfil ADMIN
     * no header {@code Authorization: Bearer <token>}.</p>
     *
     * <p>Se o campo {@code perfil} for omitido no body, o padrão é {@code ATENDENTE}.</p>
     *
     * @param dto Dados do novo usuário (nome, email, senha, perfil)
     * @return {@code 201 Created} com token JWT do novo usuário
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Registrar usuário",
            description = "Cria um novo usuário. Requer autenticação com perfil ADMIN.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Email já cadastrado ou dados inválidos"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão — requer perfil ADMIN")
            }
    )
    public ResponseEntity<LoginResponseDTO> registrar(@RequestBody @Valid RegisterRequestDTO dto) {
        return ResponseEntity.status(201).body(authService.registrar(dto));
    }
}

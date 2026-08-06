package br.com.pizzapub.service;

import br.com.pizzapub.domain.PerfilUsuario;
import br.com.pizzapub.domain.Usuario;
import br.com.pizzapub.dtos.auth.LoginRequestDTO;
import br.com.pizzapub.dtos.auth.LoginResponseDTO;
import br.com.pizzapub.dtos.auth.RegisterRequestDTO;
import br.com.pizzapub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável pelos fluxos de autenticação: login e registro de usuários.
 *
 * <p><strong>Login</strong>: delega a validação de credenciais ao {@link AuthenticationManager}
 * do Spring Security, que usa o {@link UsuarioDetailsService} e {@code BCryptPasswordEncoder}
 * internamente. Após autenticação bem-sucedida, gera e retorna um token JWT.</p>
 *
 * <p><strong>Registro</strong>: cria um novo {@link Usuario} com senha hasheada e gera
 * imediatamente um token JWT para o usuário recém-criado.
 * Endpoint protegido — apenas {@code ADMIN} pode registrar novos usuários.</p>
 *
 * <p>A anotação {@code @Lazy} em {@link AuthenticationManager} evita dependência circular
 * com o {@link br.com.pizzapub.config.SecurityConfig}.</p>
 *
 * @see JwtService
 * @see br.com.pizzapub.controller.AuthController
 */
@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    /**
     * Autentica o usuário com email e senha, retornando um token JWT.
     *
     * @param dto Credenciais de login (email + senha)
     * @return {@link LoginResponseDTO} com o token JWT e dados do usuário
     * @throws org.springframework.security.authentication.BadCredentialsException se as credenciais forem inválidas
     */
    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String token = jwtService.gerarToken(usuario);
        return new LoginResponseDTO(token, "Bearer", usuario.getNome(), usuario.getPerfil().name());
    }

    /**
     * Registra um novo usuário no sistema e retorna um token JWT.
     *
     * <p>Se o campo {@code perfil} não for informado, o padrão é {@link PerfilUsuario#ATENDENTE}.</p>
     *
     * @param dto Dados do novo usuário (nome, email, senha, perfil)
     * @return {@link LoginResponseDTO} com o token JWT do usuário criado
     * @throws RuntimeException se o email já estiver cadastrado
     */
    public LoginResponseDTO registrar(RegisterRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado: " + dto.email());
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setPerfil(dto.perfil() != null ? dto.perfil() : PerfilUsuario.ATENDENTE);

        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);
        return new LoginResponseDTO(token, "Bearer", usuario.getNome(), usuario.getPerfil().name());
    }
}

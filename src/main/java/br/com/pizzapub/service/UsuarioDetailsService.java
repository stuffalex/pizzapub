package br.com.pizzapub.service;

import br.com.pizzapub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementação customizada de {@link UserDetailsService} para o Spring Security.
 *
 * <p>Integra o repositório de usuários com o mecanismo de autenticação do Spring Security.
 * Chamado automaticamente pelo {@code DaoAuthenticationProvider} durante o processo de login.</p>
 *
 * @see br.com.pizzapub.domain.Usuario
 * @see br.com.pizzapub.config.SecurityConfig
 */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Carrega o usuário pelo email (usado como username no sistema).
     *
     * @param email Email do usuário a ser autenticado
     * @return {@link UserDetails} — a própria entidade {@link br.com.pizzapub.domain.Usuario}
     * @throws UsernameNotFoundException se nenhum usuário for encontrado com o email fornecido
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado com o email: " + email
                ));
    }
}

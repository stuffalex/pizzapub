package br.com.pizzapub.repository;

import br.com.pizzapub.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório de acesso a dados para a entidade {@link Usuario}.
 *
 * <p>Além das operações padrão herdadas de {@link JpaRepository},
 * fornece busca por email — usada pelo Spring Security no processo de autenticação.</p>
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo email (case-sensitive).
     *
     * @param email Email do usuário
     * @return {@link Optional} com o usuário encontrado, ou vazio se não existir
     */
    Optional<Usuario> findByEmail(String email);
}

package br.com.pizzapub.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entidade que representa um usuário autenticável do sistema PizzaPub.
 *
 * <p>Implementa {@link UserDetails} do Spring Security, permitindo que a entidade seja
 * usada diretamente pelo mecanismo de autenticação sem necessidade de adaptadores.</p>
 *
 * <p>A senha é armazenada como hash BCrypt — nunca em texto puro.
 * O {@link PerfilUsuario} define as permissões via {@code ROLE_<PERFIL>}.</p>
 *
 * <p>Criação do usuário inicial (admin) é feita pelo {@link br.com.pizzapub.config.DataInitializer}
 * na inicialização da aplicação.</p>
 *
 * @see PerfilUsuario
 * @see br.com.pizzapub.service.JwtService
 * @see br.com.pizzapub.config.DataInitializer
 */
@Entity
@Table(name = "tb_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome de exibição do usuário. */
    @NotBlank
    private String nome;

    /** Email usado como identificador de login (único no sistema). */
    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    /** Senha armazenada como hash BCrypt. Nunca retornada nas respostas da API. */
    @NotBlank
    private String senha;

    /** Perfil de acesso que determina as permissões do usuário. */
    @Enumerated(EnumType.STRING)
    private PerfilUsuario perfil;

    // -------------------------------------------------------------------------
    // UserDetails — Spring Security
    // -------------------------------------------------------------------------

    /**
     * Retorna as autoridades do usuário no formato {@code ROLE_<PERFIL>}.
     * Exemplo: {@code ROLE_ADMIN}, {@code ROLE_ATENDENTE}, {@code ROLE_CLIENTE}.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    /** Retorna a senha (hash BCrypt) usada pelo Spring Security na autenticação. */
    @Override
    public String getPassword() {
        return senha;
    }

    /** Retorna o email como username — identificador único de autenticação. */
    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}

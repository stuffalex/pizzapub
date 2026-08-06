package br.com.pizzapub.domain;

/**
 * Enum que define os perfis de acesso disponíveis no sistema PizzaPub.
 *
 * <ul>
 *   <li>{@code CLIENTE} — pode criar pedidos via cardápio online.</li>
 *   <li>{@code ATENDENTE} — pode visualizar e atualizar status de pedidos.</li>
 *   <li>{@code ADMIN} — acesso total: CRUD de produtos, pedidos, usuários e relatórios.</li>
 * </ul>
 *
 * <p>Cada perfil é mapeado para uma {@code GrantedAuthority} com prefixo {@code ROLE_}
 * pelo Spring Security (ex: {@code ROLE_ADMIN}).</p>
 */
public enum PerfilUsuario {
    CLIENTE,
    ATENDENTE,
    ADMIN
}

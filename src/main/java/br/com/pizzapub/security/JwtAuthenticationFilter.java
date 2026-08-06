package br.com.pizzapub.security;

import br.com.pizzapub.service.JwtService;
import br.com.pizzapub.service.UsuarioDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autenticação JWT que intercepta todas as requisições HTTP.
 *
 * <p>Executado uma única vez por requisição ({@link OncePerRequestFilter}).
 * Fluxo de validação:
 * <ol>
 *   <li>Extrai o token JWT do header {@code Authorization: Bearer <token>}.</li>
 *   <li>Extrai o email do token via {@link JwtService#extrairEmail}.</li>
 *   <li>Carrega o {@link UserDetails} correspondente via {@link UsuarioDetailsService}.</li>
 *   <li>Valida o token com {@link JwtService#isTokenValido}.</li>
 *   <li>Se válido, registra a autenticação no {@link SecurityContextHolder}.</li>
 * </ol>
 * </p>
 *
 * <p>Requisições sem header {@code Authorization} ou com token inválido prosseguem
 * sem autenticação — o {@link br.com.pizzapub.config.SecurityConfig} decide se
 * o endpoint requer autenticação ou não.</p>
 *
 * @see JwtService
 * @see br.com.pizzapub.config.SecurityConfig
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioDetailsService usuarioDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Pula o filtro se não houver token Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String email;

        try {
            email = jwtService.extrairEmail(jwt);
        } catch (Exception e) {
            // Token malformado ou inválido — deixa a requisição prosseguir sem autenticação
            filterChain.doFilter(request, response);
            return;
        }

        // Só autentica se o email foi extraído e ainda não há autenticação no contexto
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = usuarioDetailsService.loadUserByUsername(email);

            if (jwtService.isTokenValido(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}

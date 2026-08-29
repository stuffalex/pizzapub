package br.com.pizzapub.config;

import br.com.pizzapub.security.JwtAuthenticationFilter;
import br.com.pizzapub.service.UsuarioDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuração central de segurança do PizzaPub.
 *
 * <p>Define:
 * <ul>
 *   <li>Regras de autorização por endpoint e perfil ({@code SecurityFilterChain})</li>
 *   <li>Política de sessão stateless (JWT — sem cookies de sessão)</li>
 *   <li>CORS para os frontends React ({@code localhost:5173} e {@code localhost:5174})</li>
 *   <li>Beans de autenticação: {@link PasswordEncoder}, {@link AuthenticationProvider}, {@link AuthenticationManager}</li>
 *   <li>CSRF desabilitado (padrão para APIs REST stateless)</li>
 * </ul>
 * </p>
 *
 * <p><strong>Mapa de autorização</strong>:</p>
 * <pre>
 * POST  /api/auth/login       → público
 * POST  /api/auth/register    → ADMIN
 * GET   /api/produtos         → público
 * GET   /api/produtos/{id}    → público
 * POST  /api/produtos         → ADMIN
 * DELETE /api/produtos/**     → ADMIN
 * POST  /api/pedidos          → CLIENTE, ATENDENTE, ADMIN
 * GET   /api/pedidos/**       → ATENDENTE, ADMIN
 * /swagger-ui/**, /v3/**     → público (documentação)
 * /h2-console/**             → público (apenas dev)
 * Qualquer outro             → autenticado
 * </pre>
 *
 * @see JwtAuthenticationFilter
 * @see UsuarioDetailsService
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private UsuarioDetailsService usuarioDetailsService;

    /**
     * Define a cadeia de filtros de segurança com todas as regras de acesso.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desabilita CSRF — API REST stateless não usa cookies de sessão
                .csrf(AbstractHttpConfigurer::disable)

                // CORS gerenciado centralmente (substitui @CrossOrigin nos controllers)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Sem sessão HTTP — autenticação exclusivamente via JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Regras de autorização por endpoint
                .authorizeHttpRequests(auth -> auth

                        // Auth — login público, registro apenas para ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").hasRole("ADMIN")

                        // Produtos e Categorias — leitura pública, escrita restrita a ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/produtos", "/api/produtos/**", "/api/categorias", "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/produtos", "/api/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**", "/api/categorias/**").hasRole("ADMIN")

                        // Pedidos — criar e rastrear é público, consultar listagem requer autenticacao
                        .requestMatchers(HttpMethod.POST, "/api/pedidos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/rastreio/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos", "/api/pedidos/**").authenticated()

                        // Ferramentas de desenvolvimento e monitoramento — sem autenticação
                        .requestMatchers(
                                "/health",
                                "/api/health",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/h2-console/**",
                                "/error"
                        ).permitAll()

                        // Qualquer outro endpoint requer autenticação
                        .anyRequest().authenticated()
                )

                // Provedor de autenticação (BCrypt + UserDetailsService)
                .authenticationProvider(authenticationProvider())

                // Filtro JWT inserido antes do filtro padrão de username/password
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Permite frames do H2 Console (mesma origem)
                .headers(headers ->
                        headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    /**
     * Configura CORS para aceitar requisições dos frontends React.
     * Permite localhost:5173 (cardápio) e localhost:5174 (painel).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",  // pizzapub-menu (cardápio online)
                "http://localhost:5174"   // pizzapub-panel (painel de pedidos)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Encoder de senhas usando BCrypt com fator de custo padrão (10 rounds).
     * Usado para hashear senhas no registro e verificar no login.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Provedor de autenticação que integra {@link UsuarioDetailsService}
     * e {@link BCryptPasswordEncoder} para validar credenciais.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Expõe o {@link AuthenticationManager} como bean Spring para uso no {@link br.com.pizzapub.service.AuthService}.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

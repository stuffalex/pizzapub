package br.com.pizzapub.service;

import br.com.pizzapub.domain.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Serviço responsável pela geração e validação de tokens JWT.
 *
 * <p>Utiliza a biblioteca JJWT 0.12 com o algoritmo {@code HS256}.
 * A chave secreta e o tempo de expiração são configurados em {@code application.yaml}:
 * <pre>
 * jwt:
 *   secret: &lt;Base64 de 256+ bits&gt;
 *   expiration: 86400000  # 24h em ms
 * </pre>
 * </p>
 *
 * <p><strong>Claims extras no token</strong>: além do {@code sub} (email), o token inclui
 * {@code nome} e {@code perfil} do usuário para uso no frontend sem necessidade de
 * chamadas adicionais à API.</p>
 *
 * @see br.com.pizzapub.security.JwtAuthenticationFilter
 * @see br.com.pizzapub.service.AuthService
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Gera um token JWT assinado para o usuário fornecido.
     *
     * <p>O token contém as seguintes claims:
     * <ul>
     *   <li>{@code sub} — email do usuário (subject)</li>
     *   <li>{@code nome} — nome de exibição</li>
     *   <li>{@code perfil} — perfil de acesso (ex: ADMIN)</li>
     *   <li>{@code iat} — data de emissão</li>
     *   <li>{@code exp} — data de expiração</li>
     * </ul>
     * </p>
     *
     * @param userDetails O usuário autenticado
     * @return String com o token JWT assinado
     */
    public String gerarToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof Usuario usuario) {
            claims.put("nome", usuario.getNome());
            claims.put("perfil", usuario.getPerfil().name());
        }
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extrai o email (subject) de um token JWT.
     *
     * @param token Token JWT
     * @return Email do usuário contido no token
     */
    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    /**
     * Valida se o token JWT é válido para o usuário fornecido.
     *
     * <p>Verifica se o email do token corresponde ao username do {@link UserDetails}
     * e se o token não está expirado.</p>
     *
     * @param token       Token JWT a validar
     * @param userDetails Usuário cujo token será verificado
     * @return {@code true} se o token for válido; {@code false} caso contrário
     */
    public boolean isTokenValido(String token, UserDetails userDetails) {
        final String email = extrairEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpirado(token);
    }

    // -------------------------------------------------------------------------
    // Métodos privados
    // -------------------------------------------------------------------------

    private boolean isTokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

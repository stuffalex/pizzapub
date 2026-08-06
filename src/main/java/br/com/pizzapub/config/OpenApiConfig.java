package br.com.pizzapub.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Springdoc OpenAPI (Swagger UI).
 *
 * <p>Registra o esquema de segurança {@code BearerAuth} para que o Swagger UI
 * exiba o botão "Authorize", permitindo testar endpoints protegidos por JWT
 * diretamente na interface de documentação.</p>
 *
 * <p>Para autenticar no Swagger:
 * <ol>
 *   <li>Faça {@code POST /api/auth/login} e copie o {@code token} da resposta.</li>
 *   <li>Clique em "Authorize" e cole o token (sem o prefixo "Bearer ").</li>
 *   <li>Todos os endpoints protegidos passarão a enviar o header automaticamente.</li>
 * </ol>
 * </p>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PizzaPub API")
                        .version("1.0")
                        .description("API para gerenciamento de pedidos de uma pizzaria focado em arquitetura escalável.")
                        .contact(new Contact()
                                .name("Alexya Viana")
                                .email("amv.solucoes.tech@gmail.com")))
                // Aplica BearerAuth como requisito global de segurança
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                // Define o esquema de segurança JWT Bearer
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT obtido em POST /api/auth/login. Cole apenas o token, sem o prefixo 'Bearer '.")));
    }
}


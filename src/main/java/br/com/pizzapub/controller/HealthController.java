package br.com.pizzapub.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller REST para verificacao de saude da aplicacao (Health Check).
 * Endpoint publico utilizado pelo Render, Docker e ferramentas de monitoramento.
 */
@RestController
@Tag(name = "Health Check", description = "Monitoramento e integridade do sistema")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping({"/health", "/api/health"})
    @Operation(
            summary = "Verificar integridade da aplicacao",
            description = "Retorna o status da API e a conectividade com o banco de dados.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Aplicacao e banco de dados saudaveis (UP)"),
                    @ApiResponse(responseCode = "503", description = "Falha de conectividade ou servico indisponivel (DOWN)")
            }
    )
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("service", "pizzapub-api");
        health.put("timestamp", Instant.now().toString());

        boolean dbOk = isDatabaseHealthy();
        health.put("database", dbOk ? "UP" : "DOWN");

        if (!dbOk) {
            health.put("status", "DOWN");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }

        return ResponseEntity.ok(health);
    }

    private boolean isDatabaseHealthy() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(2);
        } catch (Exception e) {
            return false;
        }
    }
}

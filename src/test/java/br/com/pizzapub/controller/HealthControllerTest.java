package br.com.pizzapub.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class HealthControllerTest {

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @InjectMocks
    private HealthController healthController;

    @Test
    void deveRetornar200QuandoBancoEstaSaudavel() throws SQLException {
        Mockito.when(dataSource.getConnection()).thenReturn(connection);
        Mockito.when(connection.isValid(2)).thenReturn(true);

        ResponseEntity<Map<String, Object>> response = healthController.checkHealth();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("UP", response.getBody().get("database"));
        assertEquals("pizzapub-api", response.getBody().get("service"));
    }

    @Test
    void deveRetornar503QuandoBancoFalhar() throws SQLException {
        Mockito.when(dataSource.getConnection()).thenThrow(new SQLException("Connection refused"));

        ResponseEntity<Map<String, Object>> response = healthController.checkHealth();

        assertEquals(503, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("DOWN", response.getBody().get("status"));
        assertEquals("DOWN", response.getBody().get("database"));
    }
}

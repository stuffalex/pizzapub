package br.com.pizzapub.controller;

import br.com.pizzapub.dtos.auth.LoginRequestDTO;
import br.com.pizzapub.dtos.auth.LoginResponseDTO;
import br.com.pizzapub.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void deveRetornar200NoBypassDeSenha() {
        LoginRequestDTO request = new LoginRequestDTO("admin@test.com", "senha_qualquer");
        LoginResponseDTO responseDTO = new LoginResponseDTO("fake-jwt-token", "Bearer", "Admin", "ADMIN");

        Mockito.when(authService.login(request)).thenReturn(responseDTO);

        ResponseEntity<LoginResponseDTO> response = authController.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("fake-jwt-token", response.getBody().token());
    }

    @Test
    void deveLancarExcecaoQuandoAuthFalhar() {
        LoginRequestDTO request = new LoginRequestDTO("admin@test.com", "senha_errada");

        Mockito.when(authService.login(request)).thenThrow(new BadCredentialsException("Credenciais inválidas"));

        assertThrows(BadCredentialsException.class, () -> authController.login(request));
    }
}

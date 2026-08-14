package br.com.pizzapub.controller;

import br.com.pizzapub.domain.Pedido;
import br.com.pizzapub.domain.StatusPedido;
import br.com.pizzapub.dtos.PedidoResponseDTO;
import br.com.pizzapub.service.PedidoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PedidoControllerTest {

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private PedidoController pedidoController;

    @Test
    void deveBuscarPedidoPorCpf() {
        Pedido pedido = new Pedido();
        pedido.setId(1L);
        pedido.setCodigoRastreio(UUID.randomUUID());
        pedido.setStatus(StatusPedido.RECEBIDO);

        Mockito.when(pedidoService.buscarPorCpf("12345678900")).thenReturn(List.of(pedido));

        ResponseEntity<List<PedidoResponseDTO>> response = pedidoController.buscarPorCpf("12345678900");

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).id());
    }
}

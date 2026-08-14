package br.com.pizzapub.controller;

import br.com.pizzapub.domain.Pedido;
import br.com.pizzapub.service.PedidoService;
import br.com.pizzapub.dtos.PedidoDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Controller REST para o recurso {@code /api/pedidos}.
 *
 * <p>Recebe pedidos criados pelo cardápio online e delega a lógica ao
 * {@link br.com.pizzapub.service.PedidoService}.</p>
 */
import br.com.pizzapub.dtos.PedidoResponseDTO;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoDTO dto, UriComponentsBuilder uriBuilder) {
        Pedido pedidoSalvo = pedidoService.salvarPedido(dto);
        URI uri = uriBuilder.path("/api/pedidos/{id}").buildAndExpand(pedidoSalvo.getId()).toUri();
        return ResponseEntity.created(uri).body(PedidoResponseDTO.from(pedidoSalvo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPedidoPorId(id);
        if (pedido == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(PedidoResponseDTO.from(pedido));
    }

    @GetMapping("/rastreio/{codigo}")
    public ResponseEntity<PedidoResponseDTO> rastrearPedido(@PathVariable UUID codigo) {
        Pedido pedido = pedidoService.buscarPorCodigoRastreio(codigo);
        if (pedido == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(PedidoResponseDTO.from(pedido));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ATENDENTE', 'ADMIN')")
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos().stream().map(PedidoResponseDTO::from).toList());
    }

    @GetMapping("/cliente/{cpf}")
    public ResponseEntity<List<PedidoResponseDTO>> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(pedidoService.buscarPorCpf(cpf).stream().map(PedidoResponseDTO::from).toList());
    }
}
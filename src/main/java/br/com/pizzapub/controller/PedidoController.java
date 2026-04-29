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

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody @Valid PedidoDTO dto, UriComponentsBuilder uriBuilder) {
        // Chama o service para processar a lógica pesada
        Pedido pedidoSalvo = pedidoService.salvarPedido(dto);

        // Boas práticas REST: Retornar 201 Created e o cabeçalho 'Location' com a URL do novo recurso
        URI uri = uriBuilder.path("/api/pedidos/{id}").buildAndExpand(pedidoSalvo.getId()).toUri();

        return ResponseEntity.created(uri).body(pedidoSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        // Aqui você chamaria um método do service para buscar
        Pedido pedido = pedidoService.buscarPedidoPorId(id);
        return ResponseEntity.ok(pedido);
    }
}
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
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    /**
     * Cria um novo pedido.
     *
     * @param dto        Dados do pedido (CPF do cliente, itens, endereço, observação)
     * @param uriBuilder Usado para montar o cabeçalho {@code Location} com a URL do novo recurso
     * @return {@code 201 Created} com o corpo do pedido e o header {@code Location}
     */
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody @Valid PedidoDTO dto, UriComponentsBuilder uriBuilder) {
        // Chama o service para processar a lógica pesada
        Pedido pedidoSalvo = pedidoService.salvarPedido(dto);

        // Boas práticas REST: Retornar 201 Created e o cabeçalho 'Location' com a URL do novo recurso
        URI uri = uriBuilder.path("/api/pedidos/{id}").buildAndExpand(pedidoSalvo.getId()).toUri();

        return ResponseEntity.created(uri).body(pedidoSalvo);
    }

    /**
     * Busca um pedido pelo ID.
     *
     * @param id ID do pedido
     * @return {@code 200 OK} com o pedido, ou {@code 404} se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        // Aqui você chamaria um método do service para buscar
        Pedido pedido = pedidoService.buscarPedidoPorId(id);
        return ResponseEntity.ok(pedido);
    }

    /**
     * Lista todos os pedidos.
     *
     * @return {@code 200 OK} com a lista de pedidos
     */
    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }
}
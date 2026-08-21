package br.com.pizzapub.controller;

import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.service.ProdutoService;
import br.com.pizzapub.dtos.CadastroProdutoDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para o recurso {@code /api/produtos}.
 *
 * <p>Expõe o CRUD de produtos (pizzas) do cardápio.
 * CORS liberado para {@code http://localhost:5173} (servidor de dev React/Vite).</p>
 */
@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:5173") // Já prepara para o React/Vite
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * Lista todos os produtos cadastrados.
     *
     * @return {@code 200 OK} com a lista de produtos
     */
    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        List<Produto> produtos = (List<Produto>) produtoService.listarTodos();
        return ResponseEntity.ok(produtos);
    }

    /**
     * Cadastra um novo produto no cardápio.
     *
     * @param dto DTO com nome, descrição e preço
     * @return {@code 201 Created} com o produto criado
     */
    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody @Valid CadastroProdutoDTO dto) {
        Produto novoProduto = produtoService.salvarProduto(dto);
        return ResponseEntity.status(201).body(novoProduto);
    }

    /**
     * Busca um produto pelo ID.
     *
     * @param id ID do produto
     * @return {@code 200 OK} se encontrado, ou {@code 404 Not Found}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarProdutoPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    /**
     * Remove um produto pelo ID.
     *
     * @param id ID do produto a remover
     * @return {@code 204 No Content}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Atualiza a disponibilidade de um produto (liga/desliga exibição no cardápio).
     *
     * @param id        ID do produto
     * @param body      JSON com campo {@code disponivel} (boolean)
     * @return {@code 200 OK} com o produto atualizado
     */
    @PatchMapping("/{id}/disponivel")
    public ResponseEntity<Produto> atualizarDisponivel(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> body) {
        Boolean disponivel = body.get("disponivel");
        if (disponivel == null) return ResponseEntity.badRequest().build();
        Produto produto = produtoService.atualizarDisponivel(id, disponivel);
        return ResponseEntity.ok(produto);
    }

    /**
     * Cria uma nova variação (tamanho/preço) vinculada a um produto.
     *
     * @param produtoId ID do produto pai
     * @param body      JSON com {@code nome} e {@code preco}
     * @return {@code 201 Created} com a variação criada
     */
    @PostMapping("/{produtoId}/variacoes")
    public ResponseEntity<br.com.pizzapub.domain.Variacao> criarVariacao(
            @PathVariable Long produtoId,
            @RequestBody java.util.Map<String, Object> body) {
        String nome = (String) body.get("nome");
        Double preco = body.get("preco") instanceof Number ? ((Number) body.get("preco")).doubleValue() : null;
        if (nome == null || preco == null) return ResponseEntity.badRequest().build();
        br.com.pizzapub.domain.Variacao criada = produtoService.criarVariacao(produtoId, nome, java.math.BigDecimal.valueOf(preco));
        return ResponseEntity.status(201).body(criada);
    }
}
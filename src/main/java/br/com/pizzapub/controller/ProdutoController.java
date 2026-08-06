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
}
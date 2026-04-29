package br.com.pizzapub.controller;

import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.service.ProdutoService;
import br.com.pizzapub.dtos.CadastroProdutoDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:5173") // Já prepara para o React/Vite
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        List<Produto> produtos = (List<Produto>) produtoService.listarTodos();
        return ResponseEntity.ok(produtos);
    }

    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody @Valid CadastroProdutoDTO dto) {
        Produto novoProduto = produtoService.salvarProduto(dto);
        return ResponseEntity.status(201).body(novoProduto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarProdutoPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}
package br.com.pizzapub.controller;

import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.repository.ProdutoRepository;
import br.com.pizzapub.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoImagemController {

    @Autowired
    private SupabaseStorageService storageService;

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping("/{id}/imagem")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImagemProduto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Produto produto = produtoRepository.findById(id).orElse(null);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String imageUrl = storageService.uploadImagem(file);
            produto.setUrlImagem(imageUrl);
            produtoRepository.save(produto);
            return ResponseEntity.ok(Map.of("urlImagem", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao processar arquivo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro no upload: " + e.getMessage());
        }
    }
}

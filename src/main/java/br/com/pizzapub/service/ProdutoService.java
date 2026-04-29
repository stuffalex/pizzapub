package br.com.pizzapub.service;

import br.com.pizzapub.repository.ProdutoRepository;
import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.dtos.CadastroProdutoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvarProduto(CadastroProdutoDTO dto) {
        BigDecimal valor = new BigDecimal(dto.preco());

        Produto produto = new Produto(dto.nome(), dto.descricao(), valor);
        return produtoRepository.save(produto);
    }

    public Produto buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }

    public Iterable<Produto> listarTodos() {
        return produtoRepository.findAll();
    }
}

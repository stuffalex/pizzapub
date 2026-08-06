package br.com.pizzapub.service;

import br.com.pizzapub.repository.ProdutoRepository;
import br.com.pizzapub.domain.Produto;
import br.com.pizzapub.dtos.CadastroProdutoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Serviço responsável pela lógica de negócio relacionada a produtos (pizzas do cardápio).
 *
 * <p>Fornece operações de CRUD: cadastro, consulta por ID, listagem e remoção.
 * O campo {@code preco} do DTO chega como {@code String} e é convertido para
 * {@link java.math.BigDecimal} nesta camada.</p>
 *
 * @see br.com.pizzapub.controller.ProdutoController
 * @see br.com.pizzapub.domain.Produto
 */
@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * Persiste um novo produto no banco de dados.
     *
     * @param dto DTO com nome, descrição e preço do produto
     * @return O {@link br.com.pizzapub.domain.Produto} salvo com ID gerado
     */
    public Produto salvarProduto(CadastroProdutoDTO dto) {
        BigDecimal valor = new BigDecimal(dto.preco());

        Produto produto = new Produto(dto.nome(), dto.descricao(), valor);
        return produtoRepository.save(produto);
    }

    /**
     * Busca um produto pelo seu ID.
     *
     * @param id ID do produto
     * @return O produto encontrado, ou {@code null} se não existir
     */
    public Produto buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    /**
     * Remove um produto pelo ID.
     *
     * @param id ID do produto a ser removido
     */
    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }

    /**
     * Retorna todos os produtos cadastrados no cardápio.
     *
     * @return {@link Iterable} de todos os {@link br.com.pizzapub.domain.Produto}
     */
    public Iterable<Produto> listarTodos() {
        return produtoRepository.findAll();
    }
}

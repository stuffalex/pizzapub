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

    @Autowired
    private br.com.pizzapub.repository.CategoriaRepository categoriaRepository;

    @Autowired
    private br.com.pizzapub.repository.VariacaoRepository variacaoRepository;

    public Produto salvarProduto(CadastroProdutoDTO dto) {
        BigDecimal valor = new BigDecimal(dto.preco());

        Produto produto = new Produto(dto.nome(), dto.descricao(), valor);
        if (dto.categoriaId() != null) {
            produto.setCategoria(categoriaRepository.findById(dto.categoriaId()).orElse(null));
        }
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

    /**
     * Atualiza o campo disponível de um produto.
     *
     * @param id        ID do produto
     * @param disponivel novo valor de disponibilidade
     * @return o produto atualizado
     */
    public Produto atualizarDisponivel(Long id, Boolean disponivel) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produto.setDisponivel(disponivel);
        return produtoRepository.save(produto);
    }

    /**
     * Atualiza os dados cadastrais de um produto.
     */
    public Produto atualizarProduto(Long id, CadastroProdutoDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPreco(new BigDecimal(dto.preco()));
        if (dto.categoriaId() != null) {
            produto.setCategoria(categoriaRepository.findById(dto.categoriaId()).orElse(null));
        } else {
            produto.setCategoria(null);
        }
        return produtoRepository.save(produto);
    }

    /**
     * Cria uma nova variação (tamanho/preço) associada a um produto.
     *
     * @param produtoId ID do produto pai
     * @param nome      nome da variação (ex: P, M, G)
     * @param preco     preço da variação
     * @return a variação criada
     */
    public br.com.pizzapub.domain.Variacao criarVariacao(Long produtoId, String nome, java.math.BigDecimal preco) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        br.com.pizzapub.domain.Variacao variacao = new br.com.pizzapub.domain.Variacao(produto, nome, preco);
        return variacaoRepository.save(variacao);
    }
}

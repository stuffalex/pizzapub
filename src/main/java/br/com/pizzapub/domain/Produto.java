package br.com.pizzapub.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um produto (pizza) disponível no cardápio da pizzaria.
 *
 * <p>Mapeada para a tabela {@code tb_produto}. Um produto pode estar associado a um
 * ou mais itens de pedido via a relação {@code ManyToMany} em {@link ItemPedido}.</p>
 *
 * <p>Os campos {@code nome} e {@code preco} são obrigatórios e validados via Bean Validation.</p>
 *
 * @see ItemPedido
 */
@Entity
@Table(name = "tb_produto")
@Getter // Lombok para evitar boilerplate
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome do produto/sabor da pizza. Obrigatório. */
    @NotBlank(message = "O nome da pizza é obrigatório")
    private String nome;

    /** Descrição detalhada dos ingredientes. */
    private String descricao;

    /**
     * Preço unitário do produto.
     * Deve ser maior que zero. Usado na regra de precificação de pizzas meio a meio.
     */
    @NotNull(message = "O preço deve ser informado")
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    /** URL da imagem do produto. Futuramente armazenada no Supabase Storage. */
    private String urlImagem;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    /** Define se o produto está disponível no cardápio */
    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean disponivel = true;

    public Produto(String nome, String descricao, BigDecimal preco){
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
    }

}
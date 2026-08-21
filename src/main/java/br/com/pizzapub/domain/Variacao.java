package br.com.pizzapub.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_variacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Variacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @NotBlank(message = "O nome da variação é obrigatório")
    private String nome;

    @NotNull(message = "O preço deve ser informado")
    @PositiveOrZero(message = "O preço deve ser maior ou igual a zero")
    private BigDecimal preco;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean disponivel = true;

    public Variacao(Produto produto, String nome, BigDecimal preco) {
        this.produto = produto;
        this.nome = nome;
        this.preco = preco;
    }
}

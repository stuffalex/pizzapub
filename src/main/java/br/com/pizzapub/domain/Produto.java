package br.com.pizzapub.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @NotBlank(message = "O nome da pizza é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "O preço deve ser informado")
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    // Se quiser adicionar uma imagem depois:
    private String urlImagem;

    public Produto(String nome, String descricao, BigDecimal preco){
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
    }

}
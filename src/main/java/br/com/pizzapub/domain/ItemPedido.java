package br.com.pizzapub.domain;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_item_pedido")
@Getter // Lombok para evitar boilerplate
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToMany
    @JoinTable(
            name = "tb_item_pedido_sabores",
            joinColumns = @JoinColumn(name = "item_pedido_id"),
            inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    private List<Produto> sabores = new ArrayList<>();

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser no mínimo 1")
    private Integer quantidade;

    @NotNull(message = "O preço unitário é obrigatório")
    @DecimalMin(value = "0.01", message = "O preço unitário deve ser maior que zero")
    private BigDecimal precoUnitario;
    private String observacao;
}

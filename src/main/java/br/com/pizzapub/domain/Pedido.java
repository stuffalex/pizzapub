package br.com.pizzapub.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_pedido")
@Getter // Lombok para evitar boilerplate
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itemPedidoList = new ArrayList<>();

    public void adicionarItem(ItemPedido item) {
        this.itemPedidoList.add(item);
        item.setPedido(this);
    }

    public void removerItem(ItemPedido item) {
        this.itemPedidoList.remove(item);
        item.setPedido(null);
    }
}

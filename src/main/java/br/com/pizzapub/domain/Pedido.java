package br.com.pizzapub.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um pedido feito por um {@link Cliente}.
 *
 * <p>Um pedido agrupa um ou mais {@link ItemPedido itens}, cada um com seus sabores e quantidade.
 * A relação com os itens usa {@code CascadeType.ALL} e {@code orphanRemoval = true},
 * garantindo que itens órfãos (sem pedido) sejam removidos automaticamente.</p>
 *
 * <p>Toda a persistência é gerenciada transacionalmente em
 * {@link br.com.pizzapub.service.PedidoService#salvarPedido}.</p>
 *
 * @see Cliente
 * @see ItemPedido
 * @see br.com.pizzapub.service.PedidoService
 */
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

    /**
     * Adiciona um item ao pedido, mantendo a consistência bidirecional da associação.
     * Define o {@code pedido} do item como {@code this}.
     */
    public void adicionarItem(ItemPedido item) {
        this.itemPedidoList.add(item);
        item.setPedido(this);
    }

    /**
     * Remove um item do pedido, limpando a referência bidirecional.
     * Com {@code orphanRemoval = true}, o item removido será deletado do banco.
     */
    public void removerItem(ItemPedido item) {
        this.itemPedidoList.remove(item);
        item.setPedido(null);
    }
}

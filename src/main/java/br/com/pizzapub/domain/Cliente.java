package br.com.pizzapub.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um cliente da pizzaria.
 *
 * <p>Um cliente é identificado pelo seu {@code cpf}. Caso não exista no banco no momento
 * de um novo pedido, será criado automaticamente pelo {@link br.com.pizzapub.service.PedidoService}.
 * Seus dados podem ser complementados posteriormente.</p>
 *
 * <p>O endereço é armazenado como um {@link Endereco} embutido (Embeddable),
 * sem tabela própria — os campos ficam diretamente em {@code tb_cliente}.</p>
 *
 * @see Endereco
 * @see br.com.pizzapub.service.PedidoService
 */
@Entity
@Table(name = "tb_cliente")
@Getter // Lombok para evitar boilerplate
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;
    private String cpf;
    private String email;

    @Embedded
    private Endereco endereco;
}

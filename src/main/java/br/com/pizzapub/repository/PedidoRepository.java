package br.com.pizzapub.repository;

import br.com.pizzapub.domain.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @EntityGraph(attributePaths = {"itemPedidoList", "itemPedidoList.sabores"})
    Optional<Pedido> findByCodigoRastreio(UUID codigoRastreio);

    @EntityGraph(attributePaths = {"itemPedidoList", "itemPedidoList.sabores"})
    Optional<Pedido> findById(Long id);

    @EntityGraph(attributePaths = {"itemPedidoList", "itemPedidoList.sabores"})
    List<Pedido> findAll();

    @EntityGraph(attributePaths = {"itemPedidoList", "itemPedidoList.sabores"})
    List<Pedido> findByClienteCpf(String cpf);
}

package br.com.pizzapub.repository;

import br.com.pizzapub.domain.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemPedidoRepository  extends JpaRepository<ItemPedido, Long> {
}

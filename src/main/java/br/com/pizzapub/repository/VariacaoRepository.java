package br.com.pizzapub.repository;

import br.com.pizzapub.domain.Variacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariacaoRepository extends JpaRepository<Variacao, Long> {
}

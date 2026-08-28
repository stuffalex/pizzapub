package br.com.pizzapub.service;

import br.com.pizzapub.domain.Categoria;
import br.com.pizzapub.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public List<Categoria> listarTodos() {
        return repository.findAll();
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}

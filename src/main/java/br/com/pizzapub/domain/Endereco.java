package br.com.pizzapub.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter // Lombok para evitar boilerplate
@Setter
@Embeddable
public class Endereco {
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;
}

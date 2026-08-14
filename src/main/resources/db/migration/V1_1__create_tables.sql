-- Criação das tabelas baseadas nas entidades do sistema
CREATE TABLE tb_produto (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    preco NUMERIC(10, 2) NOT NULL,
    url_imagem VARCHAR(500)
);

CREATE TABLE tb_cliente (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(255),
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2)
);

CREATE TABLE tb_pedido (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id) REFERENCES tb_cliente(id)
);

CREATE TABLE tb_item_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL,
    observacao VARCHAR(255),
    CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) REFERENCES tb_pedido(id) ON DELETE CASCADE
);

CREATE TABLE tb_item_pedido_sabores (
    item_pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    CONSTRAINT pk_item_pedido_sabores PRIMARY KEY (item_pedido_id, produto_id),
    CONSTRAINT fk_item_sabor_item FOREIGN KEY (item_pedido_id) REFERENCES tb_item_pedido(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_sabor_produto FOREIGN KEY (produto_id) REFERENCES tb_produto(id)
);

CREATE TABLE tb_usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL
);

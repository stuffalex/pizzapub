-- Criar tabela de categorias
CREATE TABLE tb_categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Inserir categorias padrão (Pizzas e Bebidas)
INSERT INTO tb_categoria (nome) VALUES ('Pizzas');
INSERT INTO tb_categoria (nome) VALUES ('Bebidas');

-- Adicionar FK em tb_produto
ALTER TABLE tb_produto ADD COLUMN categoria_id BIGINT;
ALTER TABLE tb_produto ADD CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES tb_categoria(id);

-- Atualizar produtos existentes para 'Pizzas' (ID = 1)
UPDATE tb_produto SET categoria_id = 1;

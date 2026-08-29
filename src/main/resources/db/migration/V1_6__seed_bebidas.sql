-- ============================================================
-- V1.6 - Seed de produtos da categoria Bebidas
-- ============================================================

-- Garante que a categoria Bebidas existe
INSERT INTO tb_categoria (nome, ordem) 
VALUES ('Bebidas', 2)
ON CONFLICT (nome) DO UPDATE SET ordem = 2;

-- Atualiza a ordem da categoria Pizzas
UPDATE tb_categoria SET ordem = 1 WHERE nome = 'Pizzas';

-- Inserir produtos de Bebidas vinculados à categoria Bebidas
INSERT INTO tb_produto (nome, descricao, preco, url_imagem, categoria_id, disponivel)
SELECT 'Coca-Cola 2L', 'Refrigerante Coca-Cola 2 Litros gelada.', 14.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', id, true
FROM tb_categoria WHERE nome = 'Bebidas'
AND NOT EXISTS (SELECT 1 FROM tb_produto WHERE nome = 'Coca-Cola 2L');

INSERT INTO tb_produto (nome, descricao, preco, url_imagem, categoria_id, disponivel)
SELECT 'Fanta Laranja 2L', 'Refrigerante Fanta Laranja 2 Litros gelada.', 12.00, 'https://images.unsplash.com/photo-1624517452488-04869289c4ca', id, true
FROM tb_categoria WHERE nome = 'Bebidas'
AND NOT EXISTS (SELECT 1 FROM tb_produto WHERE nome = 'Fanta Laranja 2L');

INSERT INTO tb_produto (nome, descricao, preco, url_imagem, categoria_id, disponivel)
SELECT 'Água Mineral 500ml', 'Água mineral sem gás gelada 500ml.', 5.00, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e', id, true
FROM tb_categoria WHERE nome = 'Bebidas'
AND NOT EXISTS (SELECT 1 FROM tb_produto WHERE nome = 'Água Mineral 500ml');

INSERT INTO tb_produto (nome, descricao, preco, url_imagem, categoria_id, disponivel)
SELECT 'Budweiser Long Neck', 'Cerveja Budweiser Long Neck 330ml gelada.', 10.00, 'https://images.unsplash.com/photo-1608270586620-248524c67de9', id, true
FROM tb_categoria WHERE nome = 'Bebidas'
AND NOT EXISTS (SELECT 1 FROM tb_produto WHERE nome = 'Budweiser Long Neck');

INSERT INTO tb_produto (nome, descricao, preco, url_imagem, categoria_id, disponivel)
SELECT 'Brahma Duplo Malte', 'Cerveja Brahma Duplo Malte Long Neck 350ml.', 9.00, 'https://images.unsplash.com/photo-1608270586620-248524c67de9', id, true
FROM tb_categoria WHERE nome = 'Bebidas'
AND NOT EXISTS (SELECT 1 FROM tb_produto WHERE nome = 'Brahma Duplo Malte');

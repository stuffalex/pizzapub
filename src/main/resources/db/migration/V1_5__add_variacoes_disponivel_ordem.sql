-- ============================================================
-- V1.5 - Variações, disponibilidade e ordenação de categorias
-- ============================================================

-- 1. Campo `ordem` em tb_categoria (ordenação do cardápio)
ALTER TABLE tb_categoria ADD COLUMN IF NOT EXISTS ordem INT NOT NULL DEFAULT 0;

-- 2. Campo `disponivel` em tb_produto (habilitar/desabilitar sem deletar)
ALTER TABLE tb_produto ADD COLUMN IF NOT EXISTS disponivel BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. Tabela de variações (tamanhos e preços por variação: P, M, G etc.)
CREATE TABLE IF NOT EXISTS tb_variacao (
    id         BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL,
    nome       VARCHAR(100) NOT NULL,
    preco      NUMERIC(10, 2) NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_variacao_produto FOREIGN KEY (produto_id) REFERENCES tb_produto(id) ON DELETE CASCADE
);

-- 4. Referência à variação escolhida no item do pedido
ALTER TABLE tb_item_pedido ADD COLUMN IF NOT EXISTS variacao_id BIGINT;
ALTER TABLE tb_item_pedido ADD CONSTRAINT fk_item_pedido_variacao
    FOREIGN KEY (variacao_id) REFERENCES tb_variacao(id) ON DELETE SET NULL;

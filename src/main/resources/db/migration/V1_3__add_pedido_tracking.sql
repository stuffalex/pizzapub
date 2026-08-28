-- Adicionar as colunas na tabela tb_pedido
ALTER TABLE tb_pedido ADD COLUMN codigo_rastreio UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE tb_pedido ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'RECEBIDO';

-- Garantir unicidade do codigo_rastreio
ALTER TABLE tb_pedido ADD CONSTRAINT uk_pedido_codigo_rastreio UNIQUE (codigo_rastreio);

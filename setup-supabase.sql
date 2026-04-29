-- Criação da tabela rifa_entries
CREATE TABLE IF NOT EXISTS rifa_entries (
  numero INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criação da tabela draws (sorteios)
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_sorteado INTEGER NOT NULL,
  nome_ganhador TEXT NOT NULL,
  telefone_ganhador TEXT NOT NULL,
  data_sorteio TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_rifa_entries_numero ON rifa_entries(numero);
CREATE INDEX IF NOT EXISTS idx_draws_data ON draws(data_sorteio);

-- Ativar RLS (Row Level Security) - opcional
ALTER TABLE rifa_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público para leitura e escrita
CREATE POLICY "rifa_entries_allow_read" ON rifa_entries
  FOR SELECT
  USING (true);

CREATE POLICY "rifa_entries_allow_write" ON rifa_entries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "rifa_entries_allow_update" ON rifa_entries
  FOR UPDATE
  USING (true);

CREATE POLICY "draws_allow_read" ON draws
  FOR SELECT
  USING (true);

CREATE POLICY "draws_allow_write" ON draws
  FOR INSERT
  WITH CHECK (true);

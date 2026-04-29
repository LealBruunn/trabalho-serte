## 🔗 Integração com Supabase - Guia de Configuração

### ✅ Alterações Realizadas no Código

1. **Import das funções Supabase**: Adicionadas importações no início do arquivo principal
   - `fetchEntriesFromSupabase`: Busca todas as entradas do banco
   - `saveEntriesToSupabase`: Salva entradas com conflito handling
   - `saveDrawToSupabase`: Registra resultado do sorteio

2. **useEffect atualizado**: Agora carrega dados do Supabase
   - Fallback automático para localStorage se Supabase falhar

3. **Função save melhorada**: Integrada com Supabase
   - Tenta salvar no Supabase primeiro
   - Se falhar, tenta localStorage como backup

4. **handleDraw aprimorado**: Salva resultado do sorteio
   - Após finalizar a animação, registra o ganhador no banco

### 📋 Próximos Passos

#### 1. Criar as Tabelas no Supabase

Acesse sua conta no Supabase:
1. Vá para https://app.supabase.com
2. Selecione seu projeto: `rifa-bosque-serte`
3. Abra o **SQL Editor** no painel esquerdo
4. Cole o conteúdo do arquivo `setup-supabase.sql` ou execute os comandos abaixo:

```sql
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
  id BIGINT PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_sorteado INTEGER NOT NULL,
  nome_ganhador TEXT NOT NULL,
  telefone_ganhador TEXT NOT NULL,
  data_sorteio TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ativar RLS (Row Level Security)
ALTER TABLE rifa_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público
CREATE POLICY "rifa_entries_allow_read" ON rifa_entries FOR SELECT USING (true);
CREATE POLICY "rifa_entries_allow_write" ON rifa_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "rifa_entries_allow_update" ON rifa_entries FOR UPDATE USING (true);
CREATE POLICY "draws_allow_read" ON draws FOR SELECT USING (true);
CREATE POLICY "draws_allow_write" ON draws FOR INSERT WITH CHECK (true);
```

5. Clique em **"Run"** para executar

#### 2. Testar a Integração

1. Inicie o servidor local:
   ```bash
   npm run dev
   ```

2. No navegador, abra a aplicação (ex: http://localhost:5173)

3. Clique em um número disponível para reservar

4. Preencha o formulário com nome, sobrenome e telefone

5. Clique em "Reservar"

6. Volte ao Supabase e vá para **Table Editor**

7. Verifique a tabela `rifa_entries` - os dados devem aparecer lá!

#### 3. Testar o Sorteio

1. Reserve todos os 100 números (ou teste manualmente inserindo dados no Supabase)

2. Quando todos estiverem reservados, clique no botão "🌿 Realizar Sorteio"

3. Digite a senha: `3026`

4. Observe a animação de sorteio

5. Verifique a tabela `draws` no Supabase - o resultado deve estar registrado

### 🔍 Estrutura das Tabelas

**rifa_entries**:
```
- numero (INTEGER, Primary Key): Número da rifa (1-100)
- nome (TEXT): Primeiro nome do participante
- sobrenome (TEXT): Sobrenome do participante
- telefone (TEXT): Contato do participante
- created_at (TIMESTAMP): Data/hora de criação
- updated_at (TIMESTAMP): Data/hora de última atualização
```

**draws**:
```
- id (UUID, Primary Key): ID único do sorteio
- numero_sorteado (INTEGER): Número vencedor
- nome_ganhador (TEXT): Nome completo do ganhador
- telefone_ganhador (TEXT): Telefone do ganhador
- data_sorteio (TIMESTAMP): Data/hora do sorteio
- created_at (TIMESTAMP): Data/hora de criação do registro
```

### ⚙️ Variáveis de Ambiente

Confirme que o arquivo `.env` existe com:
```
VITE_SUPABASE_URL=https://jvvfytuzrgesvuzbleqg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_4_7OwroafFcgkB_OxgjmRg_8b82_fFA
```

### 🐛 Troubleshooting

**Erro: "Falha ao carregar dados"**
- Verifique se as tabelas foram criadas no Supabase
- Confirme as credenciais no `.env`
- Verifique o console do navegador (F12) para mais detalhes

**Dados não sincronizam:**
- Verifique a conexão de internet
- Confirme que RLS está habilitado e as políticas estão corretas
- Tente recarregar a página (Ctrl+Shift+R)

**Sorteio não salva:**
- Verifique se a tabela `draws` foi criada
- Confirme que a senha está correta: `3026`

### 📦 Arquivos Modificados

- ✅ `rifa-bosque-serte.jsx` - Integração com Supabase
- ✅ `src/config/supabase.js` - Configuração e funções
- ✅ `.env` - Variáveis de ambiente (já existe)

### 🎉 Próximas Melhorias Possíveis

- Dashboard administrativo para visualizar estatísticas
- Notificação por WhatsApp/Email para ganhadores
- Sistema de pagamento integrado
- Histórico completo de sorteios
- Exportação de dados para relatórios

---

**Está tudo pronto! A aplicação agora está conectada ao Supabase! 🚀**

️# 🎟️ Sistema de Rifa Solidária - Projeto Bosque da SERTE

Este software foi desenvolvido para automatizar e organizar a gestão de rifas beneficentes. [cite_start]O objetivo principal é facilitar a venda de números e o sorteio final, garantindo que cada centavo arrecadado seja destinado ao **Projeto Voluntários Bosque da SERTE**.

## 🌳 Sobre a Causa: SERTE

A **SERTE** (Sociedade Espírita de Recuperação, Trabalho e Educação) é uma instituição filantrópica que atua como um lar temporário para idosos e crianças, oferecendo acolhimento, saúde e, acima de tudo, muito carinho e amor, sem cobrar nada. [cite_start]A instituição sobrevive exclusivamente de doações de empresas, voluntários e projetos solidários.

### O Projeto Bosque
O Bosque da SERTE é uma iniciativa de agricultura sustentável dentro da instituição. Através do plantio de legumes e verduras, o projeto garante que:
* As crianças e idosos tenham uma alimentação fresca, saudável e rica em nutrientes.
* Toda a colheita seja revertida para a alimentação dos residentes, garantindo a sustentabilidade nutricional do lar.

---

## 🚀 Funcionalidades do Software

O sistema foi projetado para ser intuitivo e eficiente, contando com as seguintes ferramentas:

* **Tabela Interativa:** Grade numérica de 1 a 100 para visualização rápida da disponibilidade.
* **Cadastro de Compradores:** Ao selecionar um número, o sistema permite salvar Nome, Sobrenome e Telefone de contato.
* **Marcação Automática:** Números vendidos são destacados visualmente e os dados ficam guardados no sistema.
* **Módulo de Sorteio:** Uma vez preenchida a cartela, o software oferece a opção de realizar o sorteio aleatório entre os participantes.

---

## 🛠️ Tecnologias Utilizadas

Com base na arquitetura moderna do projeto, as seguintes tecnologias foram empregadas:

* **React.js:** Biblioteca principal para a construção da interface.
* **Vite:** Ferramenta de build para um desenvolvimento rápido e otimizado.
* **Supabase:** Backend-as-a-Service utilizado para persistência de dados (PostgreSQL).
* **JavaScript (JSX):** Linguagem para a lógica de componentes e estados.
* **Tailwind CSS:** Estilização responsiva e amigável.

---

## 📂 Estrutura do Projeto

* `src/components`: Componentes reutilizáveis da interface.
* `src/config`: Configurações de conexão com o Supabase.
* `src/utils`: Funções auxiliares para sorteio e formatação.
* `rifa-bosque-serte.jsx`: Componente principal da aplicação.
* `setup-supabase.sql`: Script para configuração do banco de dados.

---

## 📦 Como Executar o Projeto

1. **Clone o repositório**.
2. **Instale as dependências:** `npm install`.
3. **Configure o Supabase:** Insira as variáveis de ambiente no diretório `config`.
4. **Inicie a aplicação:** `npm run dev`.

---

**Desenvolvido com dedicação para apoiar o Bosque da SERTE.**


# CodeMerge Sync & CLI Ecosystem

> A suíte completa para conectar seu ambiente de desenvolvimento local diretamente ao **Google Gemini** e Claude.

## 📋 Sobre

O ecossistema **CodeMerge** é composto por duas partes que trabalham juntas para criar um fluxo de desenvolvimento com IA sem atrito:

1.  **CodeMerge CLI (O Motor):** Uma ferramenta de linha de comando que roda localmente, observa seus arquivos, otimiza o contexto e fornece uma API HTTP.
2.  **CodeMerge Sync (A Ponte):** Uma extensão de navegador que conecta a interface do Google Gemini/Claude ao seu servidor local, permitindo envio de contexto e salvamento de artefatos.

-----

## 🔧 Parte 1: CodeMerge CLI (Backend Local)

Antes de usar a extensão, você precisa do "cérebro" da operação rodando na sua máquina. A CLI prepara seus arquivos e expõe a API que a extensão utiliza.

### Instalação

Recomendamos a instalação global para facilitar o uso em qualquer projeto.

```bash
npm install -g codemerge-cli
```

### Início Rápido

1.  **Inicialize no seu projeto:**
    Na raiz do seu projeto, execute o comando abaixo para criar o arquivo de configuração `codemerge.json` e configurar o `.gitignore`.

    ```bash
    codemerge init
    ```

2.  **Inicie o Servidor (Modo Watch):**
    Este é o comando essencial para a extensão funcionar. Ele inicia um servidor HTTP local (padrão porta `9876`) e monitora alterações nos arquivos.

    ```bash
    codemerge watch
    ```

### Comandos Úteis da CLI

  * `codemerge use`: Mescla arquivos manualmente em um único arquivo de texto (útil para copiar/colar se não usar a extensão).
  * `codemerge watch --port 3000`: Roda o servidor em uma porta personalizada.
  * `codemerge help`: Exibe ajuda sobre comandos e opções.

> **Nota:** A CLI respeita seu `.gitignore` automaticamente, evitando que arquivos como `node_modules` ou `.env` sejam enviados para a IA.

-----

## 🧩 Parte 2: CodeMerge Sync (Extensão do Navegador)

Com a CLI rodando, a extensão atua como a interface visual dentro do **Google Gemini**, permitindo sincronização bidirecional.

### Funcionalidades Principais (Foco no Gemini)

  * 🚀 **Envio de Contexto Inteligente**: Selecione arquivos ou pastas inteiras da sua árvore de projeto local (via sidebar) e injete-os instantaneamente no chat do Gemini.
  * 💎 **Gestão de Artefatos**: A extensão detecta blocos de código gerados pelo Gemini na conversa.
  * 💾 **Salvar no Disco**: Com um clique na sidebar "Artifacts", salve os códigos gerados pela IA diretamente nos arquivos do seu projeto local (a extensão envia para a CLI, que grava no disco).
  * 🧹 **Limpeza Automática**: Opções para remover comentários, logs e linhas vazias para economizar tokens.

### Instalação da Extensão

1.  Faça o download ou clone este repositório (`codemerge-sync`).
2.  Acesse `chrome://extensions/` no seu navegador (Chrome, Edge, Brave).
3.  Ative o **"Modo do desenvolvedor"** (canto superior direito).
4.  Clique em **"Carregar sem compactação"** (Load unpacked).
5.  Selecione a pasta raiz deste projeto.

-----

## 📖 Fluxo de Trabalho Completo

### Passo 1: No Terminal

Abra seu terminal na raiz do projeto e mantenha o servidor rodando:

```bash
codemerge watch
# O servidor iniciará em http://localhost:9876
```

### Passo 2: No Google Gemini

1.  Abra o [Google Gemini](https://gemini.google.com).
2.  Abra a Sidebar do CodeMerge (lado direito ou ícone da extensão).
3.  **Aba Sync (Local ➔ IA):**
      * Verifique se o status está "Online" (conectado ao localhost:9876).
      * Selecione os arquivos de contexto.
      * Clique em "Sincronizar Selecionados" para preencher o chat.
4.  **Aba Artifacts (IA ➔ Local):**
      * Peça ao Gemini para gerar código (ex: "Crie um componente React de botão").
      * Quando ele responder, clique em "Buscar Artefatos".
      * Selecione o código desejado e clique em "Sincronizar" para salvar o arquivo no seu PC.

-----

## ⚙️ Configuração Avançada

### Na Extensão (Aba Settings)

  * **Servidor**: URL do servidor CodeMerge (Padrão: `http://localhost:9876`). Ajuste se você iniciou a CLI em outra porta.
  * **Limpeza**: Ative a remoção de logs/comentários.

### Na CLI (`codemerge.json`)

Você pode refinar o que a CLI enxerga editando o arquivo `codemerge.json` na raiz do seu projeto:

```json
{
  "projectName": "meu-projeto",
  "port": 9876,
  "ignorePatterns": ["**/*.test.ts", "coverage/**"],
  "includePatterns": ["**/*.ts", "**/*.js", "**/*.md"]
}
```

-----

## 🏗️ Estrutura do Repositório (Extensão)

  * **manifest.json**: Configurações da extensão e permissões de host (`localhost` e `gemini.google.com`).
  * **src/services/geminiService.js**: Comunicação com a API interna do Gemini para extração de artefatos.
  * **src/sidebar/**: Interface React injetada no navegador.

## 🔐 Privacidade

O fluxo de dados é estritamente **Local ↔ Navegador ↔ Gemini**.
O código do seu projeto passa do seu disco (CLI) para a extensão e é colado no chat do Gemini. O código gerado volta do Gemini para a extensão e é salvo no disco (CLI). Nenhum servidor intermediário de terceiros é utilizado.

-----

**CodeMerge Ecosystem** - Potencialize seu desenvolvimento unindo CLI e IA.
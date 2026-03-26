# CodeMerge Sync v4

Extensão de navegador de alta performance que estabelece uma ponte em tempo real entre seu ambiente de desenvolvimento local e as interfaces do **Google Gemini** e **Anthropic Claude**.

## 🚀 Recursos Principais

### 🔄 Sincronização Inteligente (Sync)
- **Seleção Granular:** Árvore de arquivos interativa com suporte a busca e filtragem.
- **Favoritos (Pinning):** Fixe arquivos essenciais para acesso rápido entre sessões.
- **Estatísticas em Tempo Real:** Contador de linhas e arquivos selecionados.
- **Modo Cópia:** Atalho rápido para copiar caminhos de arquivos formatados.

### 📦 Gestão de Artefatos (Artifacts)
- **Captura Automática:** Extrai código gerado pela IA (Gemini/Claude) instantaneamente.
- **Histórico (Snapshots):** Navegue entre diferentes versões de artefatos capturados com suporte a desfazer/refazer.
- **Upsert Local:** Salva as alterações diretamente no seu disco via CLI.
- **Limpeza de Código:** Opções para remover comentários, console.logs e linhas vazias antes de salvar.

### 🛠️ Git & Terminal
- **Automação de Commit:** Gera mensagens de commit baseadas no contexto da IA com suporte a tradução automática.
- **Execução de Comandos:** Detecta comandos sugeridos pela IA e permite executá-los no terminal local com um clique.
- **Visualização de Output:** Modal de terminal integrado para ver resultados de comandos e logs de erro (ANSI color support).

### 📝 Prompt Presets
- **Biblioteca de Prompts:** Armazene e injete rapidamente comandos complexos ou regras de sistema no chat.

## 🧠 Arquitetura e Fluxo de Dados

A extensão utiliza uma arquitetura baseada na separação de contextos de execução (Execution Worlds) do Chrome para interagir de forma nativa e não-intrusiva com os frameworks das IAs.

### Isolamento e Injeção (Content Scripts)
- **`bridge.js` (Isolated World):** Atua como o orquestrador de extensão. Comunica-se com o painel lateral (Sidebar) via APIs seguras (`chrome.runtime.onMessage`) e delega tarefas. Devido ao seu ambiente isolado, não compartilha memória com o DOM original e não pode contornar proteções do React.
- **`injector.js` (Main World):** Registrado com a flag `"world": "MAIN"`, funciona como um "agente infiltrado". Ele compartilha o mesmo objeto `window` e contexto das páginas do Claude/Gemini. Comunica-se via `window.postMessage` para despachar eventos sintéticos de Clipboard (paste) ou manipular inputs diretamente, ações que o *Isolated World* não teria permissão de executar em aplicações React rigorosas.

### Serviços e Consumo de Dados
- **`src/services/` (Claude & Gemini):** Em vez de realizar web scraping frágil no DOM para ler artefatos, os serviços operam de forma autônoma interagindo diretamente com as APIs não documentadas das plataformas. 
  - **Gemini:** O `geminiService.js` autentica-se lendo tokens em memória (`WIZ_global_data`) e forja requisições `batchexecute` complexas para extrair os blocos de código nativamente do payload RPC.
  - **Claude:** O `claudeService.js` utiliza tokens de sessão em cookies para buscar a árvore da conversa via API REST (`/api/organizations/...`), mapeando os artefatos com 100% de precisão antes mesmo de renderizarem na UI.

## 🛠️ Requisitos e Instalação

### 1. CodeMerge CLI
A extensão depende do servidor local para interagir com seus arquivos:
```bash
npm install -g codemerge-cli
codemerge init
codemerge watch
```

### 2. Extensão de Navegador
1. Acesse `chrome://extensions/`
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta raiz deste projeto.

## ⚙️ Configuração
O comportamento pode ser ajustado no arquivo `codemerge.json` na raiz do seu projeto local:
- `port`: Porta do servidor (padrão 9876).
- `ignorePatterns`: Lista de arquivos/pastas para ignorar na árvore.

---
Desenvolvido para máxima produtividade em fluxos de trabalho assistidos por IA.
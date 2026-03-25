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
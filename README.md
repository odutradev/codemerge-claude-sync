# CodeMerge Sync

Extensão de navegador que conecta seu projeto local ao **Google Gemini** e **Claude** via sidebar.

## Requisitos

**CodeMerge CLI** rodando localmente:

```bash
npm install -g codemerge-cli
codemerge init
codemerge watch
```

## Instalação da Extensão

1. Acesse `chrome://extensions/`
2. Ative o **Modo do desenvolvedor**
3. Clique em **Carregar sem compactação**
4. Selecione a pasta raiz do projeto

## Uso

Com a CLI rodando em `http://localhost:9876`, abra o Gemini ou um Claude Project e use a sidebar:

- **Sync** — selecione arquivos e envie o contexto para o chat
- **Artefatos** — capture blocos de código gerados pela IA e salve localmente
- **Settings** — configure URL do servidor, tema e opções de limpeza de código

## Configuração

Ajuste porta ou padrões de arquivos no `codemerge.json` do seu projeto:

```json
{
  "port": 9876,
  "ignorePatterns": ["**/*.test.ts"],
  "includePatterns": ["**/*.ts", "**/*.js"]
}
```

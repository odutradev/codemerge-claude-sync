# CodeMerge Claude Sync

Extensão que sincroniza automaticamente código do CodeMerge com Claude Projects.

## 🚀 Instalação

1. Abra Chrome/Edge e vá para `chrome://extensions/`
2. Ative o "Modo do desenvolvedor"
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `codemerge-claude-sync`

## ⚙️ Configuração

1. Inicie o CodeMerge no modo watch:
   ```bash
   codemerge watch [caminho] --port 9876
   ```

2. Acesse https://claude.ai e vá para um projeto

3. Configure a extensão:
   - **Servidor**: URL do CodeMerge (padrão: http://localhost:9876)
   - **Projeto**: Nome do projeto retornado pelo endpoint /health
   - **Intervalo**: Tempo entre sincronizações (segundos)

4. Clique em "🔌 Testar Conexão" para verificar

5. Use "🚀 Sincronizar Agora" para sincronização manual

6. Ative "⏰ Auto: ON" para sincronização automática

## 📋 Funcionamento

1. A extensão faz polling no servidor CodeMerge
2. Busca o conteúdo mesclado via HTTP
3. Remove arquivo existente no Claude Project (se houver)
4. Adiciona novo arquivo com conteúdo atualizado
5. Processo se repete automaticamente no intervalo configurado

## 🔧 Requisitos

- Chrome 86+ ou Edge 86+
- CodeMerge rodando em modo watch
- Acesso à página do Claude Projects

## 📝 Arquivo Gerado

Nome do arquivo: `{projectName}-merged.txt`

O arquivo contém todo o código mesclado com:
- Metadados do projeto
- Estrutura de diretórios
- Conteúdo de todos os arquivos

## 🛠️ Desenvolvimento

Estrutura da extensão:
- `manifest.json` - Configuração da extensão
- `background.js` - Service worker
- `content.js` - Script injetado no Claude
- `styles.css` - Estilos da interface
- `popup.html/js` - Popup de configuração

## 🐛 Troubleshooting

**Extensão não aparece:**
- Verifique se está em https://claude.ai
- Recarregue a página

**Erro de conexão:**
- Verifique se CodeMerge está rodando
- Confirme a URL do servidor
- Verifique CORS (CodeMerge permite por padrão)

**Arquivo não atualiza:**
- Verifique o nome do projeto
- Confirme que o merge está pronto (/health mergeReady: true)
- Verifique logs do console (F12)

## 📄 Licença

MIT

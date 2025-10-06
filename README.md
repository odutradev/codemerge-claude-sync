# CodeMerge Claude Sync

> Extensão Chrome/Edge que sincroniza automaticamente o código mesclado do CodeMerge diretamente nos seus projetos do Claude.

## 📋 Sobre

O **CodeMerge Claude Sync** é uma extensão de navegador que automatiza o processo de manter seu código atualizado no Claude Projects. Ela monitora um servidor local do CodeMerge e sincroniza automaticamente as alterações, mantendo seu contexto de IA sempre atualizado.

### ✨ Funcionalidades

- 🔄 **Sincronização Automática**: Atualiza o código no Claude em intervalos configuráveis
- 🎯 **Por Projeto**: Mantém configurações independentes para cada projeto Claude
- 🖱️ **Interface Integrada**: UI nativa dentro da página do Claude Projects
- ⚡ **Sincronização Manual**: Botão para forçar atualização imediata
- 📊 **Status Visual**: Indicadores coloridos mostram o estado da sincronização
- 💾 **Persistência**: Salva estado e configurações automaticamente
- 🔁 **Atualização Inteligente**: Só atualiza quando o conteúdo realmente muda (via hash)

## 🚀 Instalação

### 1. Instalar a Extensão

#### Chrome/Edge

1. Faça download ou clone este repositório
2. Abra o navegador e acesse:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
3. Ative o **"Modo do desenvolvedor"** (canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta raiz do projeto `codemerge-claude-sync`

### 2. Configurar o CodeMerge

Inicie o CodeMerge no modo watch:

```bash
codemerge watch
```

## 📖 Como Usar

### Primeira Configuração

1. **Acesse o Claude Projects**
   - Vá para https://claude.ai
   - Abra ou crie um projeto

2. **Configure a Extensão**
   - A interface aparecerá automaticamente acima da seção "Arquivos"
   - Digite o **nome do projeto** (deve corresponder ao nome retornado pelo CodeMerge)
   - Clique no botão **🔄** (Recarregar) para fazer o primeiro sync

3. **Inicie a Sincronização Automática**
   - Clique no botão **▶️** para iniciar
   - O botão mudará para **⏹️** quando ativo
   - A sincronização acontecerá automaticamente no intervalo configurado

### Interface

```
┌─────────────────────────────────────────┐
│ CodeMerge Sync                    ● 🟢  │
├─────────────────────────────────────────┤
│ [Nome do Projeto____] [🔄] [▶️]         │
├─────────────────────────────────────────┤
│ Status: Sincronizado                    │
│ Última sync: 14:30                      │
└─────────────────────────────────────────┘
```

#### Indicadores de Status

- 🔴 **Vermelho**: Erro na sincronização
- 🟡 **Amarelo** (pulsando): Sincronizando
- 🟢 **Verde**: Sincronizado com sucesso
- ⚪ **Cinza**: Aguardando (inativo)

#### Botões

- **🔄 Recarregar**: Força uma sincronização imediata (ignora cache)
- **▶️ Play**: Inicia a sincronização automática
- **⏹️ Stop**: Para a sincronização automática

## ⚙️ Configuração

### Parâmetros

A extensão armazena as seguintes configurações por projeto:

| Parâmetro | Padrão | Descrição |
|-----------|--------|-----------|
| `serverUrl` | `http://localhost:9876` | URL do servidor CodeMerge |
| `projectName` | - | Nome do projeto (obrigatório) |
| `updateInterval` | `5000` | Intervalo entre sincronizações (ms) |

### Armazenamento

- **Configurações globais**: Salvas em `chrome.storage.local` com a chave `config`
- **Estado por projeto**: Salvo com a chave `project_{projectId}`, incluindo:
  - Nome do projeto
  - Status de execução (ligado/desligado)
  - Último hash do conteúdo
  - Horário da última sincronização

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
codemerge-claude-sync/
├── manifest.json          # Configuração da extensão
├── package.json          # Dependências Node.js
├── codemerge.json        # Config do CodeMerge
├── publish.js            # Script de build e deploy
├── README.md             # Documentação
└── src/
    ├── background.js     # Service worker (background)
    └── scripts/
        └── upsertFile.js # Content script (UI e sync)
```

### Componentes

#### 1. Background Service Worker (`background.js`)

- Gerencia requisições HTTP via `fetch` (contorna CORS)
- Armazena e recupera configurações
- Comunica com content scripts via mensagens

#### 2. Content Script (`upsertFile.js`)

- Injeta interface na página do Claude
- Gerencia ciclo de sincronização
- Manipula arquivos no Claude (adicionar/remover)
- Mantém estado por projeto

#### 3. Fluxo de Sincronização

```
┌──────────────┐
│ Timer Ativo  │
└──────┬───────┘
       │
       v
┌──────────────────────┐
│ Busca Conteúdo       │
│ (via background.js)  │
└──────┬───────────────┘
       │
       v
┌──────────────────────┐
│ Compara Hash         │
│ (mudou?)             │
└──────┬───────────────┘
       │
       v (sim)
┌──────────────────────┐
│ Remove arquivo antigo│
└──────┬───────────────┘
       │
       v
┌──────────────────────┐
│ Adiciona novo arquivo│
└──────┬───────────────┘
       │
       v
┌──────────────────────┐
│ Salva hash e horário │
└──────────────────────┘
```

## 🔧 Desenvolvimento

### Requisitos

- Node.js 16+
- Chrome 86+ ou Edge 86+
- CodeMerge CLI instalado

### Scripts Disponíveis

```bash
# Bump de versão, build e deploy
npm run publish
```

O script `publish.js` executa:
1. Incrementa a versão no `package.json` e `manifest.json`
2. Cria arquivo ZIP em `builds/`
3. Mantém apenas as 3 builds mais recentes
4. Commit e push automático

### Estrutura do Manifest

```json
{
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://claude.ai/*",
    "http://localhost:*/*"
  ],
  "background": {
    "service_worker": "src/background.js"
  },
  "content_scripts": [{
    "matches": ["https://claude.ai/project/*"],
    "js": ["src/scripts/upsertFile.js"]
  }]
}
```

### Debugging

1. **Inspecionar Content Script**
   - Abra DevTools (F12) na página do Claude
   - Console mostrará logs da sincronização

2. **Inspecionar Service Worker**
   - Vá para `chrome://extensions/`
   - Clique em "Inspecionar visualizações" → "service worker"

3. **Verificar Storage**
   - DevTools → Application → Storage → Local Storage
   - Procure por chaves `config` e `project_{id}`

## 🔍 Troubleshooting

### A extensão não aparece no Claude

- ✅ Verifique se você está em `https://claude.ai/project/*`
- ✅ Recarregue a página (Ctrl + R)
- ✅ Verifique o console do navegador por erros
- ✅ Confirme que a extensão está ativa em `chrome://extensions/`

### Erro de conexão com o servidor

- ✅ Verifique se o CodeMerge está rodando: `curl http://localhost:9876/health`
- ✅ Confirme a URL do servidor na configuração
- ✅ Verifique se a porta está correta
- ✅ Teste o endpoint no navegador: `http://localhost:9876/{projectName}`

### O arquivo não atualiza no Claude

- ✅ Confirme que o **nome do projeto** está correto (sensível a maiúsculas)
- ✅ Verifique se o CodeMerge gerou o arquivo merge
- ✅ Use o botão **🔄 Recarregar** para forçar atualização
- ✅ Verifique os logs do console (F12)
- ✅ Teste se você consegue adicionar arquivos manualmente no Claude

### Status sempre em "Erro"

- ✅ Abra o console e veja a mensagem de erro específica
- ✅ Verifique permissões da extensão
- ✅ Teste o endpoint manualmente: `fetch('http://localhost:9876/nome-projeto')`
- ✅ Verifique se o CORS está configurado no servidor

### A sincronização não inicia automaticamente

- ✅ Clique no botão ▶️ para ativar
- ✅ Verifique se o nome do projeto foi configurado
- ✅ Recarregue a página do Claude

## 📝 Formato do Arquivo Gerado

A extensão cria um arquivo no formato:

```
{projectName}-merged.txt
```

**Estrutura do conteúdo:**

```
# Code Merge Output
Generated at: 2025-10-06T17:54:01.781Z
Source path: .
Files processed: 7
Total lines: 873
Total characters: 28602

File types:
  - json: 3 files (75 lines)
  - js: 3 files (715 lines)

Project structure & file index:
./
  - file1.js
  - file2.json
  src/
    - module.js

================================================================================
STARTOFFILE: file1.js
----------------------------------------
[conteúdo do arquivo]
----------------------------------------
ENDOFFILE: file1.js
...
```

## 🔐 Permissões

A extensão solicita as seguintes permissões:

- **`storage`**: Armazenar configurações e estado
- **`activeTab`**: Interagir com a aba ativa do Claude
- **`https://claude.ai/*`**: Injetar scripts no Claude
- **`http://localhost:*/*`**: Acessar servidor local do CodeMerge

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- [CodeMerge CLI](https://github.com/odutradev/codemerge) (adicione o link correto)
- [Claude Projects](https://claude.ai)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)

## 📮 Suporte

Encontrou um bug ou tem uma sugestão? Abra uma [issue](https://github.com/odutradev/codemerge-claude-sync/issues) no GitHub!


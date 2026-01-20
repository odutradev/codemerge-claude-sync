# Política de Privacidade - CodeMerge Sync

**Última atualização:** 20 de janeiro de 2026

Esta Política de Privacidade descreve como a extensão CodeMerge Sync coleta, usa, armazena e compartilha seus dados. Comprometemo-nos com a transparência total e a segurança das suas informações.

## 1. Coleta e Uso de Dados

A funcionalidade principal desta extensão é transferir contexto de desenvolvimento (código-fonte) do seu ambiente local para interfaces de Inteligência Artificial.

### Dados Coletados e Processados:

* **Código Fonte e Estrutura de Arquivos:** A extensão lê arquivos do seu servidor local (`localhost`) via CodeMerge CLI.
* **Metadados do Projeto:** Nomes de arquivos, caminhos de diretórios e linguagem de programação.
* **Configurações da Extensão:** Preferências de UI, URL do servidor local e filtros de exclusão.

### Finalidade do Uso:

* **Sincronização:** Injetar o código selecionado diretamente nos chats do Google Gemini e Claude Projects para análise.
* **Recuperação de Artefatos:** Ler as respostas geradas pela IA para permitir que o usuário as salve localmente.

## 2. Compartilhamento de Dados com Terceiros

Para fornecer a funcionalidade de "Sincronização", a extensão transfere dados do usuário para serviços de terceiros. A extensão não possui servidores próprios e os desenvolvedores do CodeMerge Sync não têm acesso a esses dados.

Os dados (conteúdo dos seus arquivos de código) são compartilhados com as seguintes entidades apenas quando você executa uma ação de sincronização:

### 1. Google LLC (Gemini)

* **Dados Compartilhados:** Trechos de código, conteúdo de arquivos e prompts inseridos na interface.
* **Motivo:** Processamento pela IA do Google Gemini conforme solicitado pelo usuário.
* **Política de Privacidade:** [Política de Privacidade do Google](https://policies.google.com/privacy)

### 2. Anthropic PBC (Claude)

* **Dados Compartilhados:** Trechos de código e arquivos carregados na interface de Projetos (`claude.ai`).
* **Motivo:** Análise de contexto e geração de código pela IA Claude.
* **Política de Privacidade:** [Política de Privacidade da Anthropic](https://www.anthropic.com/privacy)

## 3. Armazenamento e Retenção de Dados

* **Armazenamento Local:** As configurações da extensão e o estado da seleção de arquivos são armazenados localmente no seu navegador usando a API `chrome.storage.local`.
* **Sem Banco de Dados Externo:** Não mantemos bancos de dados externos. Todos os dados transitam diretamente entre: `Seu Computador` ↔ `Extensão` ↔ `Provedor de IA (Google/Anthropic)`.
* **Tokens de Sessão:** Tokens necessários para a comunicação com o Gemini (como `WIZ_global_data`) são mantidos estritamente na memória local do navegador e nunca são transmitidos para nós.

## 4. Medidas de Segurança

* A comunicação com o servidor local (`localhost`) ocorre via HTTP direto, sem passar pela internet pública.
* A comunicação com os provedores de IA ocorre via HTTPS criptografado dentro do contexto seguro do navegador.

## 5. Permissões do Navegador

Solicitamos apenas as permissões estritamente necessárias:

* `storage`: Para salvar preferências locais.
* `activeTab` / `scripting`: Para interagir com as páginas do Gemini e Claude.
* `host_permissions`: Para conectar ao `localhost` (ler seus arquivos) e aos domínios das IAs (escrever/ler o chat).

## 6. Contato e Controle

Como não armazenamos seus dados pessoais em nossos servidores, não há dados para solicitar exclusão do nosso lado. Para gerenciar seus dados processados pelas IAs, consulte as configurações de privacidade das respectivas plataformas (Google e Anthropic).

Para dúvidas sobre esta política, entre em contato através do repositório oficial do projeto no GitHub.
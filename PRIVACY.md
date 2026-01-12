# Política de Privacidade - CodeMerge Sync

**Última atualização:** 12 de janeiro de 2026

A extensão CodeMerge Sync respeita a sua privacidade. Esta política descreve de forma transparente como lidamos com as informações durante a utilização da extensão.

## 1. Coleta e Transmissão de Dados

- A extensão **não coleta, armazena ou transmite** nenhuma informação pessoal, dados de navegação, tokens de autenticação ou conteúdo de código para servidores externos controlados pelos desenvolvedores ou terceiros.
- A extensão funciona inteiramente no lado do cliente (client-side), processando dados apenas localmente no seu navegador.

## 2. Uso de Permissões

Abaixo justificamos o uso de cada permissão solicitada pela extensão:

- **Storage (`storage`):** Utilizado exclusivamente para salvar as suas preferências locais (como URL do servidor local, nomes dos projetos e estado da sincronização) dentro do próprio armazenamento do navegador (`chrome.storage.local`).

- **Acesso ao Host Local (`http://localhost:*`, `http://127.0.0.1:*`):** Necessário apenas para ler os arquivos gerados pela sua instância local da CLI do CodeMerge.

- **Acesso aos Sites de IA (`https://claude.ai/*`, `https://gemini.google.com/*`):** Necessário apenas para injetar os scripts que permitem a inserção do código sincronizado na interface de chat ativa.

- **ActiveTab / Scripting:** Utilizado para manipular a interface da página ativa (Claude ou Gemini) para realizar a automação do upload de arquivos.

## 3. Autenticação e Dados Sensíveis

Quaisquer tokens de sessão ou dados de autenticação (especificamente os necessários para a integração com o Google Gemini) são acessados apenas temporariamente na memória local do seu navegador para permitir o funcionamento técnico da extensão. Estes dados jamais são enviados para fora do seu ambiente local.

## 4. Alterações nesta Política

Reservamo-nos o direito de atualizar esta política de privacidade para refletir mudanças nas nossas práticas de informação. Recomendamos que reveja esta página periodicamente para obter as informações mais recentes sobre as nossas práticas de privacidade.

## 5. Contato

Se tiver dúvidas sobre esta política, por favor abra uma issue no repositório oficial do projeto no GitHub.
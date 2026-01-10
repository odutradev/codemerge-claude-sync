console.log('[GeminiSetWiz] SetWiz carregado');

const setWiz = () => {
    const selector = 'script[data-id="_gd"]';
    const targetScript = document.querySelector(selector);
    const prefix = 'window.WIZ_global_data = ';

    if (!targetScript?.textContent) {
        console.error(`[GeminiSetWiz] Erro: Script com seletor "${selector}" não encontrado ou vazio.`);
        return;
    }

    const scriptContent = targetScript.textContent.trim();

    if (!scriptContent.startsWith(prefix)) {
        console.error('[GeminiSetWiz] Erro: Conteúdo do script não corresponde ao formato esperado.');
        return;
    }

    const jsonDataString = scriptContent.substring(prefix.length).replace(/;$/, '');

    try {
        JSON.parse(jsonDataString);
        localStorage.setItem('WIZ_global_data', jsonDataString);
        console.log('[GeminiSetWiz] Sucesso: Dados salvos no localStorage.');
    } catch (error) {
        console.error('[GeminiSetWiz] Erro: Conteúdo extraído não é um JSON válido.');
    }
};

setWiz();

export default setWiz;
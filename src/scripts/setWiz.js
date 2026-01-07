const setWiz = () => {
    const selector = 'script[data-id="_gd"]';
    const targetScript = document.querySelector(selector);
    const prefix = 'window.WIZ_global_data = ';

    if (!targetScript?.textContent) {
        console.log(`[setWiz] Error: Script with selector "${selector}" not found or is empty.`);
        return;
    }

    const scriptContent = targetScript.textContent.trim();

    if (!scriptContent.startsWith(prefix)) {
        console.log('[setWiz] Error: Script content does not match the expected format.');
        return;
    }

    const jsonDataString = scriptContent.substring(prefix.length).replace(/;$/, '');

    try {
        JSON.parse(jsonDataString);
        localStorage.setItem('WIZ_global_data', jsonDataString);
        console.log('[setWiz] Success: Data saved to localStorage.');
    } catch (error) {
        console.log('[setWiz] Error: Extracted content is not valid JSON.');
    }
};

setWiz();
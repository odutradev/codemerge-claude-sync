const setWiz = () => {
    const targetScript = document.querySelector('script[data-id="_gd"]');
    const prefix = 'window.WIZ_global_data = ';
    if (!targetScript?.textContent) return;
    const scriptContent = targetScript.textContent.trim();
    if (!scriptContent.startsWith(prefix)) return;
    const jsonDataString = scriptContent.substring(prefix.length).replace(/;$/, '');
    try {
        JSON.parse(jsonDataString);
        localStorage.setItem('WIZ_global_data', jsonDataString);
    } catch {}
};

setWiz();

export default setWiz;
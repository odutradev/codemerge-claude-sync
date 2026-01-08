const geminiService = (() => {
    const getSession = () => {
        const wiz = window.WIZ_global_data || {};
        const match = window.location.pathname.match(/\/app\/([a-zA-Z0-9_]+)/);
        let id = match ? match[1] : null;
        if (id && !id.startsWith('c_')) id = 'c_' + id;

        return {
            id,
            sid: wiz.FdrFJe,
            bl: wiz.cfb2h || "boq_assistant-bard-web-server_20260106.06_p0",
            at: wiz.SNlM0e,
        };
    };

    const request = async (rpc, payload) => {
        const ses = getSession();
        if (!ses.at) throw new Error("Auth token missing.");
        
        const qs = new URLSearchParams({
            rpcids: rpc,
            'source-path': `/app/${ses.id}`,
            bl: ses.bl,
            'f.sid': ses.sid,
            hl: 'pt-BR',
            _reqid: Date.now().toString().slice(-7),
            rt: 'c'
        });

        const body = new URLSearchParams();
        body.append('f.req', JSON.stringify([[[rpc, JSON.stringify(payload), null, "generic"]]]));
        body.append('at', ses.at);

        const res = await fetch(`https://gemini.google.com/_/BardChatUi/data/batchexecute?${qs}`, {
            method: "POST",
            headers: { 
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8", 
                "x-same-domain": "1" 
            },
            body: body,
            mode: "cors",
            credentials: "include"
        });

        if (!res.ok) throw new Error(res.statusText);
        
        const txt = (await res.text()).replace(/^\)\]\}'\n/, '');
        for (const line of txt.split('\n')) {
            if (line.includes('wrb.fr') && line.includes(rpc)) {
                try {
                    const json = JSON.parse(line);
                    if (json?.[0]?.[2]) return JSON.parse(json[0][2]);
                } catch (_) {}
            }
        }
        throw new Error("Payload not found.");
    };

    const extractAttachments = (data) => {
        const files = [], seen = new Set();
        const traverse = (o) => {
            if (!o || typeof o !== 'object') return;
            if (Array.isArray(o) && o.length >= 5) {
                const [name, id, title, , content] = o;
                if (typeof name === 'string' && typeof content === 'string' && content.includes('```') && (name.includes('.') || name.startsWith('c_'))) {
                    if (!seen.has(content)) {
                        seen.add(content);
                        const lang = content.split('\n')[0].replace(/```/g, '').trim();
                        files.push({
                            id,
                            name,
                            lang: lang || 'text',
                            title: title || 'Untitled',
                            code: content.replace(/^```.*\n/, '').replace(/\n```$/, '')
                        });
                    }
                    return;
                }
            }
            Object.values(o).forEach(traverse);
        };
        traverse(data);
        return files;
    };

    return {
        getFiles: async () => {
            const data = await request("hNvQHb", [getSession().id, 50, null, 0, [1], [4], null, 1]);
            return extractAttachments(data?.[0]);
        }
    };
})();

export default geminiService;
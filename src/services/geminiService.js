const notebookLMService = (() => {

    const _getSessionData = () => {
        const wizData = JSON.parse(localStorage.getItem("WIZ_global_data"));

        if (!wizData?.FdrFJe || !wizData.KjTSIf || !wizData.SNlM0e) {
            throw new Error("window.WIZ_global_data not found or incomplete. Please run this script inside NotebookLM.");
        }

        const urlPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);

        return {
            notebookId: urlPath.split('/')[2],
            sessionId: wizData.FdrFJe,
            buildVersion: wizData.KjTSIf,
            authToken: wizData.SNlM0e,
            language: "pt",
            authUser: urlParams.get('authuser') || '0',
        };
    };

    const _makeRequest = async (rpcId, payload, notebookId) => {
        const session = _getSessionData();
        const requestId = Date.now().toString().slice(-7);
        const url = `https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute?rpcids=${rpcId}&source-path=%2Fnotebook%2F${notebookId}&bl=${session.buildVersion}&f.sid=${session.sessionId}&hl=${session.language}&authuser=${session.authUser}&_reqid=${requestId}&rt=c`;

        const fReq = [[[rpcId, JSON.stringify(payload), null, "generic"]]];
        const body = `f.req=${encodeURIComponent(JSON.stringify(fReq))}&at=${session.authToken}&`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: body,
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const rawResponse = await response.text();
        const cleanedResponse = rawResponse.replace(/^\)\]\}'\n/, '');
        const lines = cleanedResponse.split('\n');

        for (const line of lines) {
            if (line.includes('wrb.fr') && line.includes(rpcId)) {
                const parsed = JSON.parse(line);
                if (parsed && parsed[0] && parsed[0][2]) {
                    return JSON.parse(parsed[0][2]);
                }
            }
        }
        throw new Error("Failed to extract data from the response.");
    };

    const _formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const _formatTimestamp = (timestampArr) => {
        if (!Array.isArray(timestampArr) || timestampArr.length < 2) return 'N/A';
        const timestamp = new Date(timestampArr[0] * 1000 + timestampArr[1] / 1000000);
        return timestamp.toLocaleString('pt-BR');
    };

    const _formatListDocumentsResponse = (data) => {
        if (!data || !data[0]) throw new Error("Notebook data not found.");
        const notebookData = data[0];
        const documentsData = notebookData[1] || [];

        const documents = documentsData.map((docData) => {
            if (!Array.isArray(docData) || docData.length < 3) return null;
            const docInfo = docData[2] || [];
            return {
                id: Array.isArray(docData[0]) ? docData[0][0] : docData[0],
                name: docData[1],
                size: docInfo[1] ? _formatFileSize(docInfo[1]) : 'N/A',
                type: docInfo[4] === 3 ? 'PDF' : docInfo[4] === 4 ? 'Texto' : 'Outro',
                createdAt: _formatTimestamp(docInfo[2]),
                lastModified: docInfo[5] ? new Date(docInfo[5] * 1000).toLocaleString('pt-BR') : 'N/A'
            };
        }).filter(doc => doc !== null);

        return {
            name: notebookData[0] || 'Notebook sem nome',
            id: notebookData[2] || _getSessionData().notebookId,
            emoji: notebookData[3] || '📓',
            documents
        };
    };

    const _formatGetDocumentContentResponse = (data, documentId) => {
        if (!data) throw new Error("Document data not found.");
        const documentData = data[0] || [];
        const contentData = data[3] || [];
        const metadataRaw = documentData[2] || [];
        let extractedContent = [];

        const extractText = (arr) => {
            if (!arr) return;
            for (const item of arr) {
                if (typeof item === 'string') extractedContent.push(item);
                else if (Array.isArray(item)) extractText(item);
            }
        };

        extractText(contentData);

        return {
            id: documentData[0]?.[0] || documentId,
            name: documentData[1] || 'Documento sem nome',
            metadata: {
                size: metadataRaw[1] ? _formatFileSize(metadataRaw[1]) : null,
                createdAt: _formatTimestamp(metadataRaw[2]),
                creatorId: metadataRaw[3]?.[0] || null,
                type: metadataRaw[4] === 3 ? 'PDF' : metadataRaw[4] === 4 ? 'Texto' : 'Outro',
                charCount: metadataRaw[9] !== undefined ? metadataRaw[9] : null
            },
            content: extractedContent.join('\n')
        };
    };

    const _formatMutationResponse = (rawText) => {
        const hasError = rawText.includes('[5]') || rawText.includes('["e"');
        return { success: !hasError, data: rawText };
    };

    const _formatAddDocumentResponse = (rawText) => {
        try {
            const lines = rawText.split('\n').filter(line => line.trim() && isNaN(Number(line.trim())));
            for (const line of lines) {
                if (!line.includes('wrb.fr') || !line.includes("izAoDd")) continue;
                const parsed = JSON.parse(line);
                if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                        if (Array.isArray(item) && item[0] === "wrb.fr" && item[1] === "izAoDd" && item[2]) {
                            const innerData = JSON.parse(item[2]);
                            const documentId = innerData?.[0]?.[0]?.[0]?.[0];
                            const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
                            if (typeof documentId === 'string' && uuidRegex.test(documentId)) {
                                return { success: true, documentId: documentId };
                            }
                        }
                    }
                }
            }
            return { success: false, error: "Document ID not found in the response.", data: rawText };
        } catch (error) {
            console.error("Error extracting document ID:", error);
            return { success: false, error: error.message, data: rawText };
        }
    };

    const resourceAction = (config) => async (params) => {
        try {
            const { notebookId } = _getSessionData();
            const payload = config.payload(params);
            const rawData = await _makeRequest(config.rpcId, payload, notebookId);
            const result = config.formatter(rawData, params);
            return { success: true, result: result, error: null };
        } catch (error) {
            return { success: false, result: null, error: error.message };
        }
    };

    const mutationAction = (config) => async (params) => {
        try {
            const session = _getSessionData();
            const requestId = Date.now().toString().slice(-7);
            const url = `https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=${rpcId}&source-path=%2Fapp&bl=${session.buildVersion}&f.sid=${session.sessionId}&hl=${session.language}&_reqid=${requestId}&rt=c`;

            const payloadValue = config.payload(params);
            const isPayloadString = typeof payloadValue === 'string';

            const fReq = [[[config.rpcId, isPayloadString ? payloadValue : JSON.stringify(payloadValue), null, "generic"]]];
            const body = `f.req=${encodeURIComponent(JSON.stringify(fReq))}&at=${session.authToken}&`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
                body: body,
                mode: "cors",
                credentials: "include"
            });

            const rawText = await response.text();
            const result = config.formatter(rawText.replace(/^\)\]\}'\n/, ''));
            return { success: true, result: result, error: null };
        } catch (error) {
            return { success: false, result: null, error: error.message };
        }
    };

    return {
        listDocuments: resourceAction({
            rpcId: "rLM1Ne",
            payload: () => [_getSessionData().notebookId, null, [2]],
            formatter: _formatListDocumentsResponse
        }),

        getDocumentContent: resourceAction({
            rpcId: "hizoJc",
            payload: (documentId) => [[documentId], [2], [2]],
            formatter: (data, documentId) => _formatGetDocumentContentResponse(data, documentId)
        }),

        deleteDocument: mutationAction({
            rpcId: "tGMBJ",
            payload: (documentId) => `[[["${documentId}"]]],[2]]`,
            formatter: _formatMutationResponse
        }),

        editDocumentName: mutationAction({
            rpcId: "b7Wfje",
            payload: ({ documentId, newTitle }) => [null, [documentId], [[[newTitle]]]],
            formatter: _formatMutationResponse
        }),

        addTextDocument: mutationAction({
            rpcId: "izAoDd",
            payload: ({ title, content }) => [
                [
                    [null, [title, content], null, 2, null, null, null, null, null, null, 1]
                ],
                _getSessionData().notebookId,
                [2],
                [1, null, null, null, null, null, null, null, null, null, [1]]
            ],
            formatter: _formatAddDocumentResponse
        })
    };
})();

export default notebookLMService;
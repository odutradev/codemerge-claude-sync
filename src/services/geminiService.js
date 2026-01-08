const geminiService = (() => {
    
    const getSessionAuthenticationData = () => {
        const googleWizGlobalData = window.WIZ_global_data || {};
        
        const currentUrlPath = window.location.pathname;
        const isGem = currentUrlPath.includes('/gem');
        
        const pathSegments = currentUrlPath.split('/').filter(segment => segment.length > 0);
        let conversationIdentifier = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;

        if (conversationIdentifier && !conversationIdentifier.startsWith('c_')) {
            conversationIdentifier = 'c_' + conversationIdentifier;
        }

        return {
            conversationId: conversationIdentifier,
            sessionId: googleWizGlobalData.FdrFJe,
            backendLevel: googleWizGlobalData.cfb2h || "boq_assistant-bard-web-server_20260106.06_p0",
            authToken: googleWizGlobalData.SNlM0e,
            isGem
        };
    };

    const sendBatchExecuteRequest = async (rpcIdentifier, payloadData) => {
        const sessionData = getSessionAuthenticationData();

        if (!sessionData.authToken) {
            throw new Error("Token de autenticação não encontrado.");
        }
        
        const requestIdentifier = Date.now().toString().slice(-7);

        const queryParameters = new URLSearchParams({
            rpcids: rpcIdentifier,
            'source-path': window.location.pathname,
            bl: sessionData.backendLevel,
            'f.sid': sessionData.sessionId,
            hl: 'pt-BR',
            _reqid: requestIdentifier,
            rt: 'c'
        });

        const batchExecuteData = [
            [[rpcIdentifier, JSON.stringify(payloadData), null, "generic"]]
        ];

        const requestBody = new URLSearchParams();
        requestBody.append('f.req', JSON.stringify(batchExecuteData));
        requestBody.append('at', sessionData.authToken);

        const networkResponse = await fetch(`https://gemini.google.com/_/BardChatUi/data/batchexecute?${queryParameters}`, {
            method: "POST",
            headers: { 
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8", 
                "x-same-domain": "1" 
            },
            body: requestBody,
            mode: "cors",
            credentials: "include"
        });

        if (!networkResponse.ok) {
            throw new Error(networkResponse.statusText);
        }
        
        const rawResponseText = await networkResponse.text();
        const cleanedResponseText = rawResponseText.replace(/^\)\]\}'\n/, '');
        const responseLines = cleanedResponseText.split('\n');

        for (const line of responseLines) {
            if (line.includes('wrb.fr') && line.includes(rpcIdentifier)) {
                try {
                    const parsedJsonLine = JSON.parse(line);
                    if (parsedJsonLine?.[0]?.[2]) {
                        return JSON.parse(parsedJsonLine[0][2]);
                    }
                } catch (parseError) {}
            }
        }
        throw new Error("Payload de dados não encontrado na resposta do servidor.");
    };

    const extractCodeAttachmentsFromConversation = (conversationData) => {
        const extractedFiles = [];
        const processedContentSet = new Set();

        const recursivelyTraverseObject = (currentObject) => {
            if (!currentObject || typeof currentObject !== 'object') return;

            if (Array.isArray(currentObject) && currentObject.length >= 5) {
                const [fileName, fileId, title, , fileContent] = currentObject;

                const isFileNameString = typeof fileName === 'string';
                const isContentString = typeof fileContent === 'string';

                if (isFileNameString && isContentString && fileContent.includes('```')) {
                    if (fileName.includes('.') || fileName.startsWith('c_')) {
                        
                        if (!processedContentSet.has(fileContent)) {
                            processedContentSet.add(fileContent);

                            const language = fileContent.split('\n')[0].replace(/```/g, '').trim();
                            const cleanCode = fileContent.replace(/^```.*\n/, '').replace(/\n```$/, '');

                            extractedFiles.push({
                                id: fileId,
                                name: fileName,
                                language: language || 'text',
                                title: title || 'Sem Título',
                                code: cleanCode
                            });
                        }
                        return;
                    }
                }
            }

            Object.values(currentObject).forEach(recursivelyTraverseObject);
        };

        recursivelyTraverseObject(conversationData);
        return extractedFiles;
    };

    return {
        getAllFiles: async () => {
            const sessionData = getSessionAuthenticationData();
            const requestPayload = [sessionData.conversationId, 50, null, 0, [1], [4], null, 1];
            
            const responseData = await sendBatchExecuteRequest("hNvQHb", requestPayload);
            
            return extractCodeAttachmentsFromConversation(responseData?.[0]);
        }
    };
})();

export default geminiService;
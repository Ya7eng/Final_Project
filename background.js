chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'queryLLMWithPageContent') {
        const { prompt, pageContent } = request;

        const url = 'https://api.openai.com/v1/chat/completions';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer my_API',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant. Use the user's query and the page content provided to generate an answer." },
                    { role: "user", content: `Page Content: ${pageContent}\n\nQuery: ${prompt}` }
                ],
                max_tokens: 300,
            }),
        };

        (async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json();

                if (response.ok) {
                    sendResponse(data);
                } else {
                    sendResponse({ error: `API Error: ${data.error?.message || 'Unknown error'}` });
                }
            } catch (error) {
                sendResponse({ error: error.message }); // Send error to popup
            }
        })();

        return true; // Keep the message port open
    } else if (request.action === 'queryLLMWithoutPageContent') {
        const { prompt } = request;

        const url = 'https://api.openai.com/v1/chat/completions';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer my_API',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant. Use only the user's query to generate an answer." },
                    { role: "user", content: `Query: ${prompt}` }
                ],
                max_tokens: 300,
            }),
        };

        (async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json();

                if (response.ok) {
                    sendResponse(data); // Send response back to popup
                } else {
                    sendResponse({ error: `API Error: ${data.error?.message || 'Unknown error'}` });
                }
            } catch (error) {
                sendResponse({ error: error.message }); // Send error to popup
            }
        })();

        return true;
    }
});

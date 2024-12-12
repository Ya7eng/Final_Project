document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('query').value.trim();
    const resultsDiv = document.getElementById('results');

    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter a query.</p>';
        return;
    }

    resultsDiv.innerHTML = 'Extracting page content...';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        console.log("Active tab:", activeTab);

        // Inject the content script dynamically if not already loaded
        chrome.scripting.executeScript(
            {
                target: { tabId: activeTab.id },
                files: ["content.js"],
            },
            () => {
                console.log("Content script injected.");
                // Send a message to the content script
                chrome.tabs.sendMessage(activeTab.id, { action: "getPageContent" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error extracting page content:", chrome.runtime.lastError.message);
                        resultsDiv.innerHTML = `<p>Error extracting page content: ${chrome.runtime.lastError.message}</p>`;
                        return;
                    }

                    console.log("Page content extracted:", response.pageContent);
                    const pageContent = response.pageContent;

                    resultsDiv.innerHTML = 'Querying OpenAI with page content...';

                    chrome.runtime.sendMessage(
                        { action: 'queryLLMWithPageContent', prompt: query, pageContent },
                        (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error querying OpenAI:", chrome.runtime.lastError.message);
                                resultsDiv.innerHTML = `<p>Runtime Error: ${chrome.runtime.lastError.message}</p>`;
                                return;
                            }

                            if (response.error) {
                                console.error("OpenAI API Error:", response.error);
                                resultsDiv.innerHTML = `<p>Error: ${response.error}</p>`;
                                return;
                            }

                            console.log("OpenAI response with page content:", response);
                            if (response.choices && response.choices.length > 0) {
                                resultsDiv.innerHTML = `<p><strong>Answer from page content:</strong> ${response.choices[0].message.content}</p>`;
                            } else {
                                resultsDiv.innerHTML = '<p><strong>Answer from page content:</strong> No results found.</p>';
                            }

                            // Query OpenAI without page content
                            resultsDiv.innerHTML += '<p>Querying OpenAI without page content...</p>';

                            chrome.runtime.sendMessage(
                                { action: 'queryLLMWithoutPageContent', prompt: query },
                                (response) => {
                                    if (chrome.runtime.lastError) {
                                        console.error("Error querying OpenAI:", chrome.runtime.lastError.message);
                                        resultsDiv.innerHTML += `<p>Runtime Error: ${chrome.runtime.lastError.message}</p>`;
                                        return;
                                    }

                                    if (response.error) {
                                        console.error("OpenAI API Error:", response.error);
                                        resultsDiv.innerHTML += `<p>Error: ${response.error}</p>`;
                                        return;
                                    }

                                    console.log("OpenAI response without page content:", response);
                                    if (response.choices && response.choices.length > 0) {
                                        resultsDiv.innerHTML += `<p><strong>Answer without page content:</strong> ${response.choices[0].message.content}</p>`;
                                    } else {
                                        resultsDiv.innerHTML += '<p><strong>Answer without page content:</strong> No results found.</p>';
                                    }
                                }
                            );
                        }
                    );
                });
            }
        );
    });
});

console.log("Content script loaded!");

function extractVisibleText() {
    const bodyText = document.body.innerText || "";
    return bodyText.trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
        console.log("Received request to extract page content.");
        const pageContent = extractVisibleText();
        sendResponse({ pageContent });
        console.log("Page content sent.");
        return true;
    }
});

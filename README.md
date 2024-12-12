# Building Code Search Assistant

## Overview

The Building Code Search Assistant is a Google Chrome extension designed to streamline the process of searching for building codes and regulations. By integrating OpenAI's API, it allows users to query both the content of web pages they visit and OpenAI directly for additional context or clarification. The tool is user-friendly, efficient, and enhances the workflow of architects, engineers, and professionals in related industries.

## Features

### Search Page Content:
- Extracts visible text from the active webpage.
- Queries OpenAI's API using the extracted text combined with user input.
- Displays AI-generated responses based on page content.

### Direct Query to OpenAI:
- Allows users to query OpenAI directly without referencing page content.
- Displays responses below those generated from page content queries.

### Clean User Interface:
- A centered, responsive popup UI with clearly separated sections for inputs and results.

### Dynamic Content Script Injection:
- Injects the content script only when needed, ensuring minimal impact on browser performance.

## File Structure

```
project-directory/
|
|-- manifest.json        # Defines the extension’s metadata and permissions
|-- popup.html           # Defines the structure and layout of the extension’s popup interface
|-- popup.js             # Handles user interactions and communicates with other scripts
|-- content.js           # Extracts visible text from the webpage
|-- background.js        # Manages OpenAI API communication
|-- icons/               # Contains icons for extension branding
```

## Installation

1. Clone or download the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer Mode (toggle in the top-right corner).
4. Click Load Unpacked and select the project folder.
5. The extension should now appear in your extensions bar.
6. Replace `my_API` in `background.js` with your own OpenAI API key.

## Usage

### Open the Extension:
- Click the extension icon to open the popup.

### Perform a Search:
- Enter a keyword or query in the input field.
- Click Search.

### View Results:
- The extension will display:
  - Answers based on page content.
  - Answers directly from OpenAI (independent of page content).

### Adjust Content:
- Navigate to any webpage, and the extension will dynamically extract text for content-based queries.

## Development Details

### Dependencies
- Google Chrome
- OpenAI API Key

### Technologies Used
- **HTML, CSS, JavaScript**: Frontend and scripting.
- **Chrome Extensions API**: Managing browser interactions.
- **OpenAI API**: Natural language processing.

### API Integration

The extension uses OpenAI's `gpt-3.5-turbo` model to process queries. Responses are fetched via `POST` requests to the API endpoint:

`https://api.openai.com/v1/chat/completions`

#### Example Payload:

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Query: Example question." }
  ],
  "max_tokens": 300
}
```

## Known Issues

- **Rate Limiting**: Excessive queries may result in API throttling. Ensure appropriate usage.
- **Extraction Limitations**: The content script may not capture text rendered dynamically via JavaScript.
- **Error Handling**: Errors related to network issues or invalid API keys are logged but not yet displayed prominently.

## Future Enhancements

- **Improve Error Feedback**: Display detailed error messages to users in the popup.
- **Add History Functionality**: Allow users to view and revisit past queries and responses.
- **Support Multiple Languages**: Extend OpenAI queries to support multilingual building code searches.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- OpenAI for the GPT-3.5-turbo model.
- Google Chrome Extensions API documentation.

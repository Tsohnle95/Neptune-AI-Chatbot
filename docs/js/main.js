console.log('Hello World!');

// Global variables
let pageOne = document.querySelector('.landing-page-content');
let chatBotContent = document.querySelector('.chatbot-content');
let chatButtons = document.querySelectorAll('.chat-now');
const dialogueBox = document.querySelector('.dialogue-box');
const chatContent = document.querySelector('.chat-content-div');
const scrollContainer = document.querySelector('.scroll-container');
let userChatDiv = document.querySelectorAll('.user-chat-div');
const abortButton = document.querySelector('.abort-button');
const submitButton = document.getElementById('submit');
const navContentContainer = document.querySelector('.nav-content');






//check server status (heartbeat mechanism) - if receive response in 200-299 range, call setOnlineStatus with true argument
//this updates the 'online' or 'offline' server status indicator under the title on the chat page
const statusIndicator = document.querySelector('.server-status');
const API_URL = 'https://mammal-capable-really.ngrok-free.app/api/health';
// const API_URL = 'http://localhost:3000/api/health';
async function checkServerStatus() {
    try {
        // implement a timeout so if the server doesn't respond, we don't wait forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(API_URL, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            setOnlineStatus(true);
        } else {
            // server responded, but with an error 
            setOnlineStatus(false);
        }
    } catch (error) {
        // network error, server down, or timeout
        console.log('Backend server is offline');
        setOnlineStatus(false);
    }
}

function setOnlineStatus(isOnline) {
    if (isOnline) {
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
        statusIndicator.innerText = "Online";
        statusIndicator.classList.add('bold-font');
    } else {
        statusIndicator.classList.add('offline');
        statusIndicator.classList.remove('online');
        statusIndicator.innerText = "Offline";
        statusIndicator.classList.add('bold-font');
    }
}

// run on load
checkServerStatus();
// run every 5 seconds to ensure relatively accuate status update
setInterval(checkServerStatus, 5000);

//removes landing page and brings in initial chat area when user clicks chat now
chatButtons.forEach(button => {
    button.addEventListener('click', () => {
        pageOne.classList.add('hidden');
        //reveal chatbot elements
        chatBotContent.classList.remove('hidden');
    });
});


// brings the user back a page when they click the arrow button in the header
const closeArrow = document.querySelector('.left-arrow');
closeArrow.addEventListener('click', (event) => {
    if (pageOne.classList.contains('hidden') && !chatBotContent.classList.contains('hidden') && dialogueBox.classList.contains('hidden')) {
        chatBotContent.classList.add('hidden');
        pageOne.classList.remove('hidden');
    }
    else {
        dialogueBox.classList.add('hidden');
        chatContent.classList.remove('hidden');
    }
});


/* hamburger-menu toggle button */
btn = document.querySelector('.toggle-btn');
nav = document.querySelector('nav');
btn.addEventListener('click', () => {
    nav.classList.toggle('show-nav');
});

/* button to close hamburger menu */
let closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', () => {
    nav.classList.remove('show-nav');
})

/* closes hamburger menu if user clicks outside of it*/
window.addEventListener('click', (event) => {
    if (nav.classList.contains('show-nav') &&
        !nav.contains(event.target) &&
        !btn.contains(event.target)) {
        nav.classList.remove('show-nav');
    }
});

//creates user message div structure. Used when a user submits a prompt, or clicks on a suggested prompt.
const createUserMessageDiv = (messageContent) => {
    const userMessageDiv = document.createElement('div');
    const userMessageImageContainer = document.createElement('div');
    const userChatContentContainer = document.createElement('div');
    const chatContentParagraph = document.createElement('p');
    const chatContentTime = document.createElement('p');
    const createImg = document.createElement('img');
    createImg.src = 'img/user-icon.png';

    chatContentParagraph.innerText = messageContent;

    userMessageDiv.appendChild(userMessageImageContainer);
    userMessageDiv.appendChild(userChatContentContainer);
    userChatContentContainer.appendChild(chatContentParagraph);
    userMessageImageContainer.appendChild(createImg);

    userMessageDiv.classList.add('user-chat-div');
    chatContentParagraph.classList.add('chat-content');
    chatContentTime.classList.add('chat-time');

    return userMessageDiv;
}

//creates AI message structure 
const createAiMessageDiv = (prompt) => {
    const aiChatDiv = document.createElement('div');
    const aiMessageImageContainer = document.createElement('div');
    const aiChatContentDiv = document.createElement('div');
    const chatContent = document.createElement('p');
    const chatTime = document.createElement('p');
    const createImg = document.createElement('img');
    createImg.src = 'img/svg/neptune-icon.svg';

    chatContent.innerText = prompt;

    aiChatDiv.appendChild(aiMessageImageContainer);
    aiMessageImageContainer.appendChild(createImg);
    aiChatDiv.appendChild(aiChatContentDiv);
    aiChatContentDiv.appendChild(chatContent);
    aiChatContentDiv.appendChild(chatTime);

    aiChatDiv.classList.add('ai-chat-div');
    chatContent.classList.add('chat-content');
    chatTime.classList.add('chat-time');

    return aiChatDiv;
}

//creates nav-content-div populated with user and chatbot message history, and appends it to nav-content
const createChatHistory = (aiMessage, userMessage) => {
    const navContentDiv = document.createElement('div');
    const navContentContainer = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'img/svg/message.svg';
    const messageBox = document.createElement('div');
    const chatTitle = document.createElement('p');
    const chatText = document.createElement('p');
    const chatTime = document.createElement('p');

    messageBox.append(chatTitle, chatText, chatTime);
    navContentContainer.append(img, messageBox);
    navContentDiv.appendChild(navContentContainer);

    messageBox.classList.add('message-box');
    navContentDiv.classList.add('nav-content-div');
    navContentContainer.classList.add('nav-content-container');
    chatTitle.classList.add('chat-title');
    chatText.classList.add('chat-text');
    chatTime.classList.add('chat-time');

    chatText.textContent = aiMessage;
    chatTitle.textContent = userMessage;

    return navContentDiv;
}

// Helper to create a pause
// const delay = (ms) => new Promise(res => setTimeout(res, ms));

//conversation history array 
let conversationHistory = [
    {
        role: "system",
        content: `
You are Neptune, a friendly AI assistant.

Formatting rules (strict):
- Use short paragraphs (1–2 sentences max).
- Insert a blank line between paragraphs and sentences.
- Keep responses under 5 sentences unless asked for detail.
`
    }
]

let currentHistoryElement = null;

let abortController = null;
//handles form submission. builds user message div, adds input value to message element, and appends to scroll container.
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let formInput = event.target.elements['chat-input'];
    let message = formInput.value;
    if (!message.trim()) return;

    form.reset();

    //call createUserMessageDiv to build message structure, append it to chat container, and reset form.

    submitButton.querySelector('img').classList.add('hidden');
    abortButton.classList.remove('hidden');
    const newChatMessage = createUserMessageDiv(message);
    scrollContainer.appendChild(newChatMessage);

    conversationHistory.push({ role: "user", content: message })

    if (!chatContent.classList.contains('hidden') && dialogueBox.classList.contains('hidden')) {
        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    /** 
     * --- text streaming logic ---
     */
    const newAiMessage = createAiMessageDiv("Thinking...");
    scrollContainer.appendChild(newAiMessage);

    // select the specific paragraph tag inside the new div to update its text
    const aiParagraph = newAiMessage.querySelector('.chat-content');

    try {
        // const response = await fetch('http://localhost:3000/api/chat', {
        const response = await fetch('https://mammal-capable-really.ngrok-free.app/api/chat', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ messages: conversationHistory }),
            signal: signal
        });

        if (response.status === 429) {
            aiParagraph.innerText = "Message limit reached. Try again in 15 minutes.";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        /**
         * --- reading the stream ---
         *    Instead of `await response.json()`, we use a reader.
         *    this allows us to process the response chunk by chunk.
         */
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Clear the placeholder 'thinking' text
        aiParagraph.innerText = "";

        let fullAiResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            //  Get the chunk of text
            const chunk = decoder.decode(value, { stream: true });

            //  Split chunk into individual characters
            const characters = chunk.split('');

            // Loop through each character to type it out slowly
            for (const char of characters) {
                if (signal.aborted) break;
                aiParagraph.textContent += char;
                fullAiResponse += char; //store each character in the full ai response string 
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                await new Promise(r => setTimeout(r, 10)) // a natural typing speed
            }

            // If aborted during character loop, stop the whole stream
            if (signal.aborted) break;
        }

        if (!signal.aborted) {
            conversationHistory.push({ role: "assistant", content: fullAiResponse });

            if (!currentHistoryElement) {
                // SCENARIO: First message of a new chat
                currentHistoryElement = createChatHistory(fullAiResponse, message);
                navContentContainer.appendChild(currentHistoryElement);
            } else {
                // SCENARIO: Adding to the same sidebar entry
                const messageBox = currentHistoryElement.querySelector('.message-box');
                const chatTime = currentHistoryElement.querySelector('.chat-time');

                const newTitle = document.createElement('p');
                newTitle.className = 'chat-title';
                newTitle.textContent = message;

                const newText = document.createElement('p');
                newText.className = 'chat-text';
                newText.textContent = fullAiResponse;

                // Append new messages ABOVE the time element
                messageBox.insertBefore(newTitle, chatTime);
                messageBox.insertBefore(newText, chatTime);
            }
        }

        // else {
        //     aiParagraph.textContent += " [Message stopped by user]";
        // }


    } catch (error) {
        if (error.name === 'AbortError') { // check this later, i dont think this error name is correct
            console.log('User aborted the request.');
            return;
        }
        console.error('Error', error);
        aiParagraph.innerText = "Error connecting to server.";
    } finally {
        abortController = null;
        submitButton.querySelector('img').classList.remove('hidden');
        abortButton.classList.add('hidden');
    }

});


abortButton.addEventListener('click', () => {
    console.log('abort button clicked');
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
})

/* removes chat-content-div and brings in dialogue div after user clicks a submit prompt button */
const submitPrompt = document.querySelectorAll('.submit-prompt');
submitPrompt.forEach(prompt => {
    prompt.addEventListener('click', async () => {
        const message = prompt.querySelector('.recommendation-content').innerText;
        if (!message.trim()) return;
        //create the user message div structure
        const newChatMessage = createUserMessageDiv(message);
        //append user div to scroll container
        scrollContainer.appendChild(newChatMessage);

        conversationHistory.push({ role: "user", content: message })

        submitButton.querySelector('img').classList.add('hidden');
        abortButton.classList.remove('hidden');

        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');

        abortController = new AbortController();
        const signal = abortController.signal;


        const newAiMessage = createAiMessageDiv("Thinking...");
        scrollContainer.appendChild(newAiMessage);
        const aiParagraph = newAiMessage.querySelector('.chat-content');

        try {
            // const response = await fetch('http://localhost:3000/api/chat', {
            const response = await fetch('https://mammal-capable-really.ngrok-free.app/api/chat', {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ messages: conversationHistory }),
                signal: signal
            });

            if (response.status === 429) {
                aiParagraph.innerText = "Max message limit reached. Try again in 15 minutes.";
                return;
            }

            if (!response.ok) throw new Error(`HTTP error!`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            aiParagraph.innerText = "";

            let fullAiResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // split into characters for typing effect
                const characters = chunk.split('');

                for (const char of characters) {
                    if (signal.aborted) break;
                    aiParagraph.textContent += char;
                    fullAiResponse += char; //store each character in the full ai response string 
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    await new Promise(r => setTimeout(r, 10)) // a natural typing speed
                }
                // If aborted during character loop, stop the whole stream
                if (signal.aborted) break;
            }

            if (!signal.aborted) {
                conversationHistory.push({ role: "assistant", content: fullAiResponse });
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('User aborted the request.');
                return;
            }
            console.error('Error', error);
            aiParagraph.innerText = "Error connecting to server.";
        } finally {
            abortController = null;
            submitButton.querySelector('img').classList.remove('hidden');
            abortButton.classList.add('hidden');
        }

    });
});

//scrolls to the bottom of the chat container as messages fill the container
const scrollToBottom = () => {
    // forces the last element in the container into view
    const lastChild = scrollContainer.lastElementChild;
    if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // using a slight delay to ensure the browser has recalculated the new height after element is added
    setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, 50);
};

const observer = new MutationObserver((mutationsList) => {
    //  scroll to bottom after container's content changes (message is added)
    scrollToBottom();
});

// observe children being added | text changing
observer.observe(scrollContainer, {
    childList: true,
    attributes: true     // watches for attribute changes (like class changes)
});





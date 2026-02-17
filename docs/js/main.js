console.log('Hello World!');

// Global variables
let pageOne = document.querySelector('.landing-page-content');
let chatBotContent = document.querySelector('.chatbot-content');
let chatButtons = document.querySelectorAll('.chat-now');
const dialogueBox = document.querySelector('.dialogue-box');
const chatContent = document.querySelector('.chat-content-div');
const scrollContainer = document.querySelector('.scroll-container');
let userChatDiv = document.querySelectorAll('.user-chat-div');

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

// Helper to create a pause
const delay = (ms) => new Promise(res => setTimeout(res, ms));
//handles form submission. builds user message div, adds input value to message element, and appends to scroll container.
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let formInput = event.target.elements['chat-input'];
    let message = formInput.value;
    form.reset();

    //call createUserMessageDiv to build message structure, append it to chat container, and reset form.
    const newChatMessage = createUserMessageDiv(message);
    scrollContainer.appendChild(newChatMessage);

    if (!chatContent.classList.contains('hidden') && dialogueBox.classList.contains('hidden')) {
        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');
    }

    /** 
     * --- text streaming logic ---
     */
    const newAiMessage = createAiMessageDiv("Thinking..."); 
    scrollContainer.appendChild(newAiMessage);
    
    // select the specific paragraph tag inside the new div to update its text
    const aiParagraph = newAiMessage.querySelector('.chat-content');

    try {
        const response = await fetch('https://mammal-capable-really.ngrok-free.app/api/chat', { 
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ prompt: message })
        });

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

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            //  Get the chunk of text
            const chunk = decoder.decode(value, { stream: true });

            //  Split chunk into individual characters
            const characters = chunk.split('');

            // Loop through each character to type it out slowly
            for (const char of characters) {
                aiParagraph.textContent += char;
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                
                // adjust speed here (Lower = Faster, Higher = Slower)
                // 10ms to 30ms is usually a good natural speed.
                await delay(0); 
            }
        }

    } catch (error) {
        console.error('Error', error);
        aiParagraph.innerText = "Error connecting to server.";
    }

});

/* removes chat-content-div and brings in dialogue div after user clicks a submit prompt button */
const submitPrompt = document.querySelectorAll('.submit-prompt');
submitPrompt.forEach(prompt => {
    prompt.addEventListener('click', async () => {
        const message = prompt.querySelector('.recommendation-content').innerText;
        //create the user message div structure
        const newChatMessage = createUserMessageDiv(message);
        //append user div to scroll container
        scrollContainer.appendChild(newChatMessage);

        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');

     
        const newAiMessage = createAiMessageDiv("Thinking..."); 
        scrollContainer.appendChild(newAiMessage);
        const aiParagraph = newAiMessage.querySelector('.chat-content');

        try {
            const response = await fetch('https://mammal-capable-really.ngrok-free.app/api/chat', { 
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) throw new Error(`HTTP error!`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            aiParagraph.innerText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                
                // split into characters for typing effect
                const characters = chunk.split('');

                for (const char of characters) {
                    aiParagraph.textContent += char;
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    
                   
                    await delay(0);
                }
            }

        } catch (error) {
            console.error('Error', error);
            aiParagraph.innerText = "Error.";
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
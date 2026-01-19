console.log('Hello World!');

// Global variables
let pageOne = document.querySelector('.landing-page-content');
let chatBotContent = document.querySelector('.chatbot-content');
let chatButtons = document.querySelectorAll('.chat-now');
const dialogueBox = document.querySelector('.dialogue-box');
const chatContent = document.querySelector('.chat-content-div');

//removes landing page and brings in initial chat area
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

/* FORM SUBMISSION AND AI / USER MESSAGE CONTENT DISTRIBUTION */

/* prevent form submission when user submits a prompt, store input value in a variable, clear input and focus input for users next message */
let capturedMessage = '';
const form = document.querySelector('form');
const formInput = document.querySelector('#chat-input');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    capturedMessage = formInput.value;
    console.log(capturedMessage);
    formInput.value = '';
    // formInput.focus();
})

/* removes chat-content-div and brings in dialogue div after user clicks a submit prompt button */
const submitPrompt = document.querySelectorAll('.submit-prompt');
submitPrompt.forEach(prompt => {
    prompt.addEventListener('click', () => {
        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');
        // formInput.focus();
    });
});

/* carries content over from recommendation prompts to the dialogue box for ai submission after user clicks a recommendation */
let suggestedAiChats = document.querySelectorAll('.ai-chat-recommendation');
suggestedAiChats.forEach(chat => {
    chat.addEventListener('click', () => {
        let textToTransfer = chat.querySelector('.recommendation-content').innerText;
        let userChatDiv = document.querySelector('.user-chat-div');
        userChatDiv.querySelector('.chat-content').innerText = textToTransfer;
    })
});

/* puts the users chat messages on the right side of the screen */
let userChatDiv = document.querySelectorAll('.user-chat-div');
userChatDiv.forEach(div => {
    div.style = 'flex-direction: row-reverse';
});




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

//handles form submission. builds user message div, adds input value to message element, and appends to scroll container.
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let formInput = event.target.elements['chat-input'];
    let message = formInput.value;
    if (!chatContent.classList.contains('hidden') && dialogueBox.classList.contains('hidden')) {
        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');
    }
    //call createUserMessageDiv to build message structure, append it to chat container, and reset form.
    const newChatMessage = createUserMessageDiv(message);
    scrollContainer.appendChild(newChatMessage);
    form.reset();
});


/* removes chat-content-div and brings in dialogue div after user clicks a submit prompt button */
const submitPrompt = document.querySelectorAll('.submit-prompt');
submitPrompt.forEach(prompt => {
    prompt.addEventListener('click', () => {
        const message = prompt.querySelector('.recommendation-content').innerText;
        //create the user message div structure
        const newChatMessage = createUserMessageDiv(message);
        //append user div to scroll container
        scrollContainer.appendChild(newChatMessage);

        chatContent.classList.add('hidden');
        dialogueBox.classList.remove('hidden');
        // formInput.focus();
    });
});







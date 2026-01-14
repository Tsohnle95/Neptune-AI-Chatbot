console.log('Hello World!');

//remove landing page content and bring in chatbot content
let pageOne = document.querySelector('.landing-page-content');
let chatButtons = document.querySelectorAll('.chat-now');

chatButtons.forEach(button => {
    button.addEventListener('click', () => {
        // hide landing-page elements
        pageOne.style.display = 'none';
        //reveal chatbot elements
        let chatBotContent = document.querySelector('.chatbot-content');
        chatBotContent.style.display = 'flex';
    });
});

/**************** TOGGLE BUTTONS  **************** /
/* hamburger-menu */
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

/* prevent form submission when user submits a prompt, store input value in a variable, clear input and focus input for users next message */
let capturedMessage = '';
const form = document.querySelector('form');
const formInput = document.querySelector('#chat-input');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    capturedMessage = formInput.value;
    console.log(capturedMessage);
    formInput.value = '';
    formInput.focus();
})

/* removes chat-content-div and brings in dialogue div after user clicks a submit prompt button */
const chatContent = document.querySelector('.chat-content-div');
const dialogueBox = document.querySelector('.dialogue-box');
const submitPrompt = document.querySelectorAll('.submit-prompt');
submitPrompt.forEach(prompt => {
    prompt.addEventListener('click', () => {
        chatContent.style.display = 'none';
        dialogueBox.style.setProperty('display', 'block', 'important');
        formInput.focus();
    })
})





/* puts the users chat messages on the right side of the screen */
let userChatDiv = document.querySelectorAll('.user-chat-div');
userChatDiv.forEach(div => {
    div.style = 'flex-direction: row-reverse';
});

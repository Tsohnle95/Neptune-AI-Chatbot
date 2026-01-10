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



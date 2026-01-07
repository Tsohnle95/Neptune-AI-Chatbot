console.log('Hello World!');

//remove landing page content and bring in chatbot content
let pageOne = document.querySelectorAll('.page-1');
let chatButtons = document.querySelectorAll('.chat-now');

chatButtons.forEach(button => {
    button.addEventListener('click', () => {
        // hide landing-page elements
        pageOne.forEach(element => {
            element.style.display = 'none';
        });
        //reveal chatbot elements
        let chatBotContent = document.querySelectorAll('.chatbot-content');
        chatBotContent.forEach(element => {
            element.style.display = 'block';
        });

    });
});


// return landing page content and remove chatbot content
let returnButtons = document.querySelectorAll('.chatbot-content');

returnButtons.forEach(element => {
    element.addEventListener('click', () => {
          //hide chatbot content
        element.style.display = 'none';
        //reveal landingpage content
        pageOne.forEach(element => {
            element.style.display = 'block';
        });
    });
});

// working on removing all the chatbot content, strange loop 





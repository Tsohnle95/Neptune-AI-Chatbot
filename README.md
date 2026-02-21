# Neptune-AI-Chatbot
Neptune AI -  a self hosted full-stack AI Chatbot

https://tsohnle95.github.io/Neptune-AI-Chatbot/

Latest Implementations:
- backend server heartbeat checker (displays green online text if the backend is live and red offline text if not)
- conversation history: model will remember all messages sent during that conversation (32k context window)
- abort button to stop fetch request after prompt is sent
- chat streaming: the model streams broken up json lines to the front end as it processes its response. to the user, this makes the model appear to respond almost instantly, instead of having you sit there for multiple seconds until the entire response object is resolved at once, and appears on the front end abruptly

TODO:
- research and learn how to implement a markdown library so the model can style its own output using markdown syntax
- implement MCP (or similar) functionality so that a second smaller model can parse incoming prompts, summarize and assign titles for that specific conversation, and build the chat history sections in the sidebar (hamburger menu) 
- add chat history data to client browser localstorage db to temporarily store multiple chat sessions

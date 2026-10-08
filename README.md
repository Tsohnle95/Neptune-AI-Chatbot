# Neptune-AI-Chatbot 🤖 - I am currently in the process of re-designing the front-end, back-end functionality (Model responses) will be unavailable during this time!

Neptune AI is a full-stack AI Chatbot App built with Node.js, Express, HTML, CSS (Sass), and Vanilla JavaScript. 

Originally, the backend and AI model were self-hosted on an old laptop. Due to resource limitations, the backend has been migrated and is now hosted on Render, a reliable hosting provider for Node.js backends.

Users can send a prompt from the front-end. The request is piped through the Node.js backend to the LLM (powered by Groq), which streams the response back through the pipeline to the user's interface.

**Live URL:** [https://tsohnle95.github.io/Neptune-AI-Chatbot/](https://tsohnle95.github.io/Neptune-AI-Chatbot/)

## Features

- **Decoupled Architecture:** Front-end and back-end are fully separated for better scalability and maintenance.
- **AI Integration:** Backend is integrated with the Groq SDK for fast LLM responses.
- **Streaming Responses:** The chatbot features real-time text streaming, similar to SOTA models, providing an interactive user experience.
- **Responsive Design:** Built with modern CSS/Sass, offering a clean UI that scales beautifully across mobile and desktop devices.
- **Rate Limiting:** The backend is protected with express-rate-limit to manage and prevent abuse.

## Tech Stack

### Front-End
- **HTML5 & CSS3** (Styled with Sass)
- **Vanilla JavaScript** (No heavy frontend frameworks)
- **Vite** (Development build tool)
- Hosted on **GitHub Pages**

### Back-End
- **Node.js & Express.js**
- **Groq SDK** (For AI model inference)
- **Morgan & CORS** (For logging and cross-origin resource sharing)
- Hosted on **Render**

## Running the Project Locally

If you'd like to run Neptune AI locally, follow these steps:

### Prerequisites
- Node.js installed on your machine.
- A free [Groq API Key](https://console.groq.com/keys) for the LLM.

### 1. Clone the repository
```bash
git clone https://github.com/Tsohnle95/Neptune-AI-Chatbot.git
cd Neptune-AI-Chatbot
```

### 2. Set up the Back-End
```bash
cd back-end
npm install
```
Create a `.env` file in the `back-end` directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```
Start the backend server:
```bash
npm run dev
```

### 3. Set up the Front-End
Open a new terminal window:
```bash
cd docs
npm install
npm run dev
```
Navigate to the local URL provided by Vite (usually `http://localhost:5173`) to view the application.

## Roadmap (Future Enhancements)

- Implement Markdown parsing to style the AI's output using markdown syntax.
- Implement session memory / chat history using localstorage or a server-side database.
- Add dynamic chat titles and summarization.

---
*Developed by Ty Sohnle*

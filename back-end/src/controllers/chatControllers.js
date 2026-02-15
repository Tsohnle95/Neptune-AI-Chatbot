// src/controllers/chatController.js

export const handleChat = async (req, res) => {
    // destructure 'prompt' from the request body
    const { prompt } = req.body;

    // validation
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    

    //  Setup the Timeout Controller
    // allows us to cancel the request if it hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        //  call local ollama api
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:1b",
                prompt: prompt,
                stream: false,
                options: { num_predict: 250 }
            }),
            signal: controller.signal // <--- links the kill switch
        });

        clearTimeout(timeoutId); // Success! Stop the timer.

        // Check if Ollama says no
        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}`);
        }

        const data = await response.json();

        // send the final answer
        res.json({ response: data.response });

    } catch (error) {
        // Handle Timeout specifically
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'Request timed out' });
        }

        // Log the real error
        console.error("Error in chatController:", error);

        // Send a generic safe error
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 
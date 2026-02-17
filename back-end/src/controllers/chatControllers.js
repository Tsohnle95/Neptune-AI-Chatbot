// src/controllers/chatController.js

export const handleChat = async (req, res) => {
    // destructure 'prompt' from the request body
    const { prompt } = req.body;

    // validation
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
    }


    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); 

    try {
        /**
         * set `stream: true` here. This tells Ollama to send 
         * partial JSON objects as they are generated, rather than 
         * waiting for the whole thought process to finish.
         */
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2:1b",
                prompt: prompt,
                stream: true, 
                system: "You are Neptune, a brief, polite assistant."
            })
        });

        /**
         * stream reader setup
         * We get a reader from the fetch response body.
         * The TextDecoder is used to convert binary data (chunks) into readable text.
         */
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ''; // Holds partial data in case a JSON object is split between chunks

        while (true) {
            // Read the next chunk of data from Ollama
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the binary value to a string and add to our buffer
            buffer += decoder.decode(value, { stream: true });

            // Split buffer by newlines because Ollama sends one JSON object per line
            let lines = buffer.split('\n');
            
            // Keep the last line in the buffer (it might be incomplete/cut off)
            buffer = lines.pop(); 

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    // Parse the specific line
                    const json = JSON.parse(line);
                    // Write just the text response part to the client immediately
                    if (json.response) {
                        res.write(json.response);
                    }
                } catch (e) {
                    console.error("Error parsing JSON line", e);
                }
            }
        }
        
        // Close the connection when done
        res.end();

    } catch (error) {
        console.error('Streaming Error:', error);
        res.status(500).end();
    }
};
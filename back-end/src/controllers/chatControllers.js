// src/controllers/chatController.js

export const handleChat = async (req, res) => {
    // destructure 'prompt' from the request body
    const { messages } = req.body;

    // validation
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const ollamaAbortController = new AbortController();

    // if the user cancels the request in the browser, trigger the kill switch for the ollama connection.
  res.on('close', () => {
        // If the stream hasn't finished naturally, but the response closed,
        // it means the user disconnected or aborted.
        if (!res.writableEnded) {
            console.log("Client disconnected/aborted. Stopping Ollama...");
            ollamaAbortController.abort();
        }
    });

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
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: ollamaAbortController.signal,
            body: JSON.stringify({
                model: "llama3.2:1b",
                messages: messages,
                stream: true,
                // system: "You are a friendly assistant named Neptune. Keep answers under 5 sentences.",
                options: {
                    num_predict: 550,
                    temperature: 0.6
                }
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
                    if (json.message && json.message.content) {
                        res.write(json.message.content);
                    }
                } catch (e) {
                    console.error("Error parsing JSON line", e);
                }
            }
        }

        // Close the connection when done
        res.end();
} catch (error) {
        if (error.name === 'AbortError') {
            console.log('Ollama request was successfully stopped by backend.');
        } else {
            console.error('Streaming Error:', error);

            // only send 500 if we haven't started streaming text yet
            if (!res.headersSent) {
                res.status(500).json({ error: 'Streaming failed' });
            } else {
                // If we already started streaming, just end the connection
                res.end();
            }
        }
    } finally {
        // Tensures the response is always closed, 
        // preventing memory leaks if the loop breaks unexpectedly
        if (!res.writableEnded) {
            res.end();
        }
    }
};
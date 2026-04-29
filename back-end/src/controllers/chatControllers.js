import Groq from "groq-sdk";

// Initialize Groq inside the controller or in a separate config file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const handleChat = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages are required' });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
        const stream = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a friendly assistant named Neptune. Keep answers under 5 sentences."
                },
                ...messages
            ],
            model: "llama-3.3-70b-versatile", 
            // model: "llama-3.1-8b-instant",
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                // Write the text directly to the stream
                res.write(content);
            }
        }

        res.end();
    } catch (error) {
        console.error('Groq Streaming Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'AI communication failed' });
        } else {
            res.end();
        }
    }
};
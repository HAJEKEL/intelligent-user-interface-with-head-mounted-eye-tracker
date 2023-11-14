const OpenAI = require('openai').default;
const EventEmitter = require('events');

class OpenAIService extends EventEmitter {
    constructor(apiKey, systemMessage) {
        super();
        this.openai = new OpenAI({ apiKey });
        this.systemMessage = systemMessage;
        this.messages = [systemMessage]; // Initialize with the system message
    }

    async generateResponse(transcription) {
        try {
            // Add user's message and keep the last 10 messages
            this.messages.push({ role: 'user', content: transcription });
            this.messages = this.messages.slice(-10);

            const stream = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: this.messages, // Use the updated message history
                stream: true,
            });
    
            let buffer = '';
    
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                buffer += content;
    
                if (this.isResponseComplete(buffer) && this.hasMinimumWordCount(buffer, 3)) {
                    this.emit('response', buffer.trim());
                    buffer = ''; // Clear the buffer after emitting
                }
            }
    
            // Emit any remaining content in the buffer
            if (buffer.trim().length > 0) {
                this.emit('response', buffer.trim());
            }
        } catch (error) {
            this.emit('error', error);
        }
    }
    
    // Check if the response is complete based on punctuation
    isResponseComplete(text) {
        return /[.?!]\s*$/.test(text);
    }
    
    // Check if the text has at least a minimum number of words
    hasMinimumWordCount(text, minWords) {
        const words = text.trim().split(/\s+/);
        return words.length >= minWords;
    }
}
module.exports = { OpenAIService };

const Groq = require('groq-sdk');

let groq;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const getAIResponse = async (prompt) => {
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      console.error('Groq error:', err.message);
      throw new Error(`AI error: ${err.message}`);
    }
  }

  throw new Error('No AI provider available. Please set GROQ_API_KEY');
};

const streamAIResponse = async (prompt, onChunk) => {
  if (groq) {
    try {
      const stream = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        stream: true,
      });
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) onChunk(text);
      }
      return;
    } catch (err) {
      console.error('Groq stream error:', err.message);
    }
  }
  const response = await getAIResponse(prompt);
  onChunk(response);
};

module.exports = { getAIResponse, streamAIResponse };

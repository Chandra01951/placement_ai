const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Get AI response using Gemini (primary) or OpenAI (fallback)
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const getAIResponse = async (prompt) => {
  // Try Gemini first
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error('Gemini error:', err.message);
    }
  }

  // Try OpenAI fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI error:', err.message);
    }
  }

  throw new Error('No AI provider available. Please set GEMINI_API_KEY or OPENAI_API_KEY');
};

/**
 * Stream AI response
 */
const streamAIResponse = async (prompt, onChunk) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) onChunk(text);
      }
      return;
    } catch (err) {
      console.error('Gemini stream error:', err.message);
    }
  }
  // Fallback: non-streaming
  const response = await getAIResponse(prompt);
  onChunk(response);
};

module.exports = { getAIResponse, streamAIResponse };

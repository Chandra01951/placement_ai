import { useState, useRef, useEffect } from 'react';
import API from '../utils/api';

const suggestions = [
  'How do I improve my resume ATS score?',
  'What DSA topics should I focus on for Amazon?',
  'How to answer "Tell me about yourself"?',
  'What is the difference between BFS and DFS?',
  'How to prepare for HR interviews?',
  'Explain time and space complexity',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your PlacementAI assistant 🤖\n\nI can help you with:\n• Resume tips & ATS optimization\n• Interview preparation\n• DSA and coding problems\n• Career guidance\n• Company-specific preparation\n\nWhat would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const { data } = await API.post('/ai/chat', { message: msg, history: history.slice(0, -1) });
      setMessages(p => [...p, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', content: '❌ Sorry, I encountered an error. Please check your API key configuration or try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-gray-300">{line.slice(2)}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-white">{line.slice(2, -2)}</p>;
      }
      return line ? <p key={i} className="text-gray-300">{line}</p> : <br key={i} />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] animate-fade-in">
      <div className="mb-4 shrink-0">
        <h1 className="section-heading">🤖 AI Chatbot</h1>
        <p className="text-gray-400 text-sm mt-1">Your 24/7 placement preparation assistant.</p>
      </div>

      <div className="flex-1 flex flex-col bg-surface-800/50 border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${msg.role === 'assistant' ? 'bg-primary-600' : 'bg-white/10'}`}>
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1 ${msg.role === 'assistant' ? 'bg-surface-900 border border-white/[0.06] rounded-tl-sm' : 'bg-primary-600 rounded-tr-sm'}`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm">🤖</div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-surface-900 border border-white/[0.06]">
                <div className="flex gap-1">
                  {[0, 1, 2].map(d => <div key={d} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.2}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-gray-500 text-xs mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.06] rounded-lg text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/[0.06] p-3 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything about placements..."
            className="input-field flex-1 text-sm py-2.5"
            disabled={loading}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn-primary shrink-0 px-4">
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

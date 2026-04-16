import { type FC, useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.ts';

interface Message {
  text: string;
  isBot: boolean;
  time: string;
}

const Chatbot: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I am the Institute AI Assistant. How can I help you today?", isBot: true, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMsg = { text: query, isBot: false, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot/query', { 
        query: newMsg.text,
        email: user?.email 
      });
      
      setMessages(prev => [...prev, {
        text: res.data.response,
        isBot: true,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    } catch {
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all transform flex items-center justify-center z-40 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 transition-all transform origin-bottom-right z-50 flex flex-col overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} h-[500px]`}>
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
               <Bot className="w-5 h-5 text-white" />
             </div>
             <div>
               <h3 className="font-medium text-sm">AI Assistant</h3>
               <p className="text-[10px] text-indigo-100 flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span> Online</p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.isBot ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                {msg.text}
                <div className={`text-[10px] mt-1 text-right ${msg.isBot ? 'text-slate-400' : 'text-indigo-200'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 w-16 shadow-sm flex items-center justify-center space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!query.trim() || isTyping}
              className="absolute right-2 p-1.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;

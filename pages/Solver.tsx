import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Cpu, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { solveProblem } from '../services/geminiService';
import { Message, SolveMode } from '../types';
import { useAuth } from '../context/AuthContext';

const Solver: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hi! I can help you solve math, science, or coding problems. Upload a photo or type your question.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<SolveMode>(SolveMode.FAST);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeChange = (newMode: SolveMode) => {
    if (newMode === SolveMode.DEEP && !user?.isPremium) {
       navigate('/premium');
       return;
    }
    setMode(newMode);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (!user) {
        navigate('/login');
        return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const responseText = await solveProblem(userMsg.content, userMsg.image || null, mode);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative">
      {/* Header / Mode Switcher */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          AI Solver 
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
        </h2>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => handleModeChange(SolveMode.FAST)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
              mode === SolveMode.FAST 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" /> Fast
          </button>
          <button
            onClick={() => handleModeChange(SolveMode.DEEP)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
              mode === SolveMode.DEEP 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {user?.isPremium ? <Cpu className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            Deep Think
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="User upload" 
                  className="mb-3 rounded-lg max-h-60 object-contain bg-black/20" 
                />
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 border border-slate-700 flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="text-xs text-slate-400 ml-2">
                {mode === SolveMode.DEEP ? "Reasoning deeply (Premium)..." : "Solving..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        {!user && (
            <div className="absolute inset-x-0 bottom-0 top-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <p className="text-lg font-bold mb-4">Sign in to start solving</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold transition-all"
                >
                    Login to Continue
                </button>
            </div>
        )}
        {selectedImage && (
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
            <ImageIcon className="w-4 h-4" />
            <span>Image selected</span>
            <button 
              onClick={() => setSelectedImage(null)}
              className="hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-xl transition-colors"
            title="Upload Image"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === SolveMode.DEEP ? "Ask a complex question..." : "Type a problem or paste text..."}
              className="w-full bg-slate-900 text-white rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700 resize-none h-[50px] max-h-[150px]"
              style={{ minHeight: '50px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl transition-all ${
              (!input.trim() && !selectedImage) || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default Solver;
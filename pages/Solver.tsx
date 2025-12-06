import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Cpu, Zap, Lock, Volume2, Copy, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { solveProblem } from '../services/geminiService';
import { Message, SolveMode } from '../types';
import { useAuth } from '../context/AuthContext';

const Solver: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Load initial messages from local storage if available
  const loadMessages = () => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages() || [
    {
      id: 'welcome',
      role: 'model',
      content: 'Hi! I am UniMind. **Upload a photo** or **type your question** below to get started!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<SolveMode>(SolveMode.FAST);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const clearHistory = () => {
    if(window.confirm("Clear chat history?")) {
        setMessages([{
          id: 'welcome',
          role: 'model',
          content: 'History cleared. How can I help you now?',
          timestamp: Date.now()
        }]);
    }
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
      // Save solve to recent activity
      const activity = { type: 'solve', preview: userMsg.content.substring(0, 30) + "...", date: new Date().toLocaleDateString() };
      const currentActivity = JSON.parse(localStorage.getItem('recent_activity') || '[]');
      localStorage.setItem('recent_activity', JSON.stringify([activity, ...currentActivity].slice(0, 5)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Basic Text-to-Speech
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, '')); // Strip markdown
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Helper to format text with bold and code
  const formatText = (text: string) => {
    // Simple parser for bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|```[\s\S]*?```)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('```') && part.endsWith('```')) {
            return (
                <pre key={index} className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2 border border-slate-700">
                    <code className="text-indigo-300 font-mono text-sm">{part.slice(3, -3)}</code>
                </pre>
            );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
             return <code key={index} className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-200 font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative">
      {/* Header / Mode Switcher */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
             <h2 className="font-bold text-lg text-white">UniMind Solver</h2>
             {messages.length > 2 && (
                 <button onClick={clearHistory} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors" title="Clear History">
                     <Trash2 className="w-4 h-4" />
                 </button>
             )}
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => handleModeChange(SolveMode.FAST)}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              mode === SolveMode.FAST 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> 
            <span className="hidden sm:inline">Fast</span>
          </button>
          <button
            onClick={() => handleModeChange(SolveMode.DEEP)}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              mode === SolveMode.DEEP 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {user?.isPremium ? <Cpu className="w-3 h-3 sm:w-4 sm:h-4" /> : <Lock className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">Deep Think</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
             {/* Avatar for model */}
             {msg.role === 'model' && (
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1 shadow-lg">
                     <Cpu className="w-4 h-4 text-white" />
                 </div>
             )}

            <div 
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-sm relative group ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.image && (
                <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
                    <img 
                    src={msg.image} 
                    alt="User upload" 
                    className="max-h-60 w-full object-cover" 
                    />
                </div>
              )}
              
              <div className="prose-content whitespace-pre-wrap leading-relaxed text-[15px]">
                {msg.role === 'model' ? formatText(msg.content) : msg.content}
              </div>

              {/* Message Actions */}
              {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => speak(msg.content)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Read Aloud">
                          <Volume2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => copyToClipboard(msg.content)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Copy Text">
                          <Copy className="w-4 h-4" />
                      </button>
                  </div>
              )}
            </div>
            
            {/* Avatar for User (Optional or simple placeholder) */}
            {msg.role === 'user' && (
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 ml-3 mt-1 overflow-hidden">
                     {user?.photoURL ? <img src={user.photoURL} alt="Me" /> : <div className="w-2 h-2 bg-indigo-400 rounded-full" />}
                 </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mr-3 mt-1">
                 <Cpu className="w-4 h-4 text-white" />
             </div>
             <div className="bg-slate-800 rounded-2xl rounded-bl-none p-5 border border-slate-700 max-w-[75%]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-indigo-300 font-medium">
                        {mode === SolveMode.DEEP ? "Reasoning deeply..." : "Analyzing..."}
                    </span>
                </div>
                {mode === SolveMode.DEEP && (
                    <div className="mt-3 text-xs text-slate-500 border-t border-slate-700 pt-2">
                        Applying multi-step logic chains (Thinking Model 2.5)
                    </div>
                )}
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
        {!user && (
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent flex flex-col items-center justify-end pb-8 z-20">
                <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                   Login to Chat <Lock className="w-4 h-4" />
                </button>
            </div>
        )}

        {selectedImage && (
          <div className="mb-3 inline-flex items-center gap-3 p-2 bg-slate-700/50 rounded-xl border border-slate-600/50 backdrop-blur-sm">
            <img src={selectedImage} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0 px-2">
                <p className="text-sm font-medium text-white truncate">Image attached</p>
                <p className="text-xs text-slate-400">Ready to analyze</p>
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="p-1 hover:bg-slate-600 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3 relative z-10 items-end">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 mb-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-xl transition-colors shrink-0"
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
          
          <div className="flex-1 relative bg-slate-900 rounded-2xl border border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === SolveMode.DEEP ? "Ask a complex question for deep reasoning..." : "Type your homework question here..."}
              className="w-full bg-transparent text-white py-3 px-4 focus:outline-none resize-none max-h-[150px] min-h-[50px] leading-relaxed"
              rows={1}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`p-3 mb-1 rounded-xl transition-all shrink-0 ${
              (!input.trim() && !selectedImage) || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Solver;
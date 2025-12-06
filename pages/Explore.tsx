import React, { useState } from 'react';
import { Search, MapPin, Globe, ExternalLink, GraduationCap, Loader2, TrendingUp, BookOpen } from 'lucide-react';
import { exploreTopic, generateQuiz } from '../services/geminiService';
import { SearchResult } from '../types';

const Explore: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: SearchResult[] } | null>(null);
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'quiz'>('search');

  const handleSearch = async (e: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = overrideQuery || query;
    if (!q.trim()) return;

    if (overrideQuery) setQuery(overrideQuery);

    setLoading(true);
    setResult(null);
    setQuiz(null);

    try {
      if (activeTab === 'search') {
        const data = await exploreTopic(q);
        setResult(data);
      } else {
        const quizData = await generateQuiz(q);
        setQuiz(quizData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const trendingTopics = [
    "Artificial Intelligence Engineering",
    "Sustainable Architecture Universities",
    "Quantum Computing Basics",
    "Medical School Requirements UK",
    "MBA Programs in USA"
  ];

  const quickQuizzes = [
    "Calculus I Derivatives",
    "World History 1945-Present",
    "Organic Chemistry Nomenclature",
    "Python Programming Basics"
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-bold">Explore & Learn</h1>
        <p className="text-slate-400">Search for universities, topics, or generate practice quizzes.</p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800 rounded-xl mb-6 border border-slate-700">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'search' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Search University/Topic
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Generate Quiz
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeTab === 'search' ? "E.g., MIT Computer Science, Stanford Admissions..." : "E.g., Calculus, Organic Chemistry..."}
            className="w-full bg-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p>Consulting the archives...</p>
          </div>
        )}

        {!loading && !result && !quiz && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-300">
                        <TrendingUp className="w-5 h-5" /> Trending Searches
                    </h3>
                    <div className="space-y-2">
                        {trendingTopics.map((topic, i) => (
                            <button 
                                key={i}
                                onClick={() => { setActiveTab('search'); handleSearch(null as any, topic); }}
                                className="block w-full text-left p-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-300">
                        <BookOpen className="w-5 h-5" /> Popular Quizzes
                    </h3>
                    <div className="space-y-2">
                        {quickQuizzes.map((topic, i) => (
                            <button 
                                key={i}
                                onClick={() => { setActiveTab('quiz'); handleSearch(null as any, topic); }}
                                className="block w-full text-left p-3 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Search Results Display */}
        {activeTab === 'search' && result && !loading && (
          <div className="space-y-6 animate-fade-in pb-10">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                AI Overview
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                {result.text}
              </div>
            </div>

            {result.sources.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all group"
                  >
                    <div className="mt-1 p-2 bg-slate-900 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-indigo-300 truncate group-hover:text-indigo-200">{source.title}</h4>
                      <p className="text-xs text-slate-500 truncate mt-1">{source.url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Display */}
        {activeTab === 'quiz' && quiz && !loading && (
           <div className="space-y-6 animate-fade-in pb-10">
             <h3 className="text-xl font-bold text-center">Practice Quiz: {query}</h3>
             {quiz.map((q, idx) => (
               <div key={idx} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                 <p className="font-medium text-lg mb-4 text-slate-200">
                   <span className="text-indigo-400 mr-2">{idx + 1}.</span>
                   {q.question}
                 </p>
                 <div className="grid gap-3">
                   {q.options.map((opt: string, optIdx: number) => (
                     <button
                       key={optIdx}
                       className="text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-700 transition-all focus:ring-2 focus:ring-indigo-500"
                       onClick={(e) => {
                         const btn = e.currentTarget;
                         if (opt === q.answer) {
                            btn.classList.add('!bg-emerald-900/50', '!border-emerald-500', '!text-emerald-200');
                            btn.innerText += " ✅";
                         } else {
                            btn.classList.add('!bg-rose-900/50', '!border-rose-500', '!text-rose-200');
                            btn.innerText += " ❌";
                         }
                       }}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <details className="text-sm text-slate-400 cursor-pointer">
                        <summary className="hover:text-indigo-400 transition-colors">Show Answer</summary>
                        <p className="mt-2 text-emerald-400 font-medium">{q.answer}</p>
                    </details>
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
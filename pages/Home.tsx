import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, FlaskConical, Globe, Microscope, Search, Clock, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_activity');
    if (saved) {
        try { setRecentActivity(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const features = [
    {
      title: "Math Solver",
      icon: <Calculator className="w-6 h-6 text-emerald-400" />,
      desc: "Algebra, Calculus, and Geometry solutions.",
      path: "/solve"
    },
    {
      title: "Science Helper",
      icon: <FlaskConical className="w-6 h-6 text-rose-400" />,
      desc: "Physics, Chemistry, and Biology concepts.",
      path: "/solve"
    },
    {
      title: "Uni Search",
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      desc: "Find universities and programs worldwide.",
      path: "/explore"
    },
    {
      title: "Quiz Me",
      icon: <Search className="w-6 h-6 text-amber-400" />,
      desc: "Generate practice quizzes for any topic.",
      path: "/explore"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="py-8 md:py-12 relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700 p-8">
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Study Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">UniMind</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Your all-in-one AI tutor. Solve complex problems with deep reasoning, explore universities with real-time data, and master your subjects.
            </p>
            <div className="flex flex-wrap gap-4">
            <button 
                onClick={() => navigate('/solve')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:scale-105"
            >
                Start Learning <ArrowRight className="w-5 h-5" />
            </button>
            <button 
                onClick={() => navigate('/explore')}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl font-bold transition-all border border-slate-600 hover:border-slate-500"
            >
                Explore Campus
            </button>
            </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Features Grid */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Microscope className="w-6 h-6 text-indigo-400" />
                Tools & Resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                    <div 
                    key={idx}
                    onClick={() => navigate(feature.path)}
                    className="p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                    >
                    <div className="mb-4 p-3 rounded-xl bg-slate-900 w-fit group-hover:scale-110 transition-transform border border-slate-700 group-hover:border-slate-600">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{feature.desc}</p>
                    </div>
                ))}
                </div>
            </section>
        </div>

        {/* Sidebar: Daily Quote & Recent */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                <Quote className="w-8 h-8 text-indigo-300 mb-4 opacity-50" />
                <p className="text-lg font-medium text-slate-200 italic mb-4">
                    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                </p>
                <p className="text-sm text-indigo-300 font-bold">— Malcolm X</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    Recent Activity
                </h3>
                {recentActivity.length > 0 ? (
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <span className="text-sm text-slate-300 truncate max-w-[150px]">{item.preview}</span>
                                <span className="text-xs text-slate-500">{item.date}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No recent activity yet. Start solving!</p>
                )}
            </div>

            {!user?.isPremium && (
                <div onClick={() => navigate('/premium')} className="cursor-pointer bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all group">
                    <h3 className="font-bold text-lg text-yellow-500 mb-2 group-hover:text-yellow-400">Go Premium</h3>
                    <p className="text-sm text-slate-400">Get unlimited Deep Solve reasoning and faster speeds.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
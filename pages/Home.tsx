import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, FlaskConical, Globe, Microscope, Search } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Math Solver",
      icon: <Calculator className="w-6 h-6 text-emerald-400" />,
      desc: "Step-by-step solutions for Algebra to Calculus.",
      path: "/solve"
    },
    {
      title: "Science Helper",
      icon: <FlaskConical className="w-6 h-6 text-rose-400" />,
      desc: "Physics, Chemistry, and Biology concepts explained.",
      path: "/solve"
    },
    {
      title: "Uni Search",
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      desc: "Find your dream university and program details.",
      path: "/explore"
    },
    {
      title: "Research",
      icon: <Search className="w-6 h-6 text-amber-400" />,
      desc: "Deep dive into academic topics with citations.",
      path: "/explore"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-4 text-center md:text-left py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Master Your Studies with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Your personal AI tutor for homework help, university exploration, and academic research. Powered by Gemini 2.5.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
          <button 
            onClick={() => navigate('/solve')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
          >
            Start Solving <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/explore')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full font-semibold transition-all border border-slate-700"
          >
            Explore Universities
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Microscope className="w-6 h-6 text-indigo-400" />
          What do you want to learn?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(feature.path)}
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="mb-4 p-3 rounded-lg bg-slate-900 w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Powered by Advanced Reasoning</h2>
          <p className="text-slate-300 mb-6 max-w-xl">
            UniMind uses Google's latest Gemini 2.5 Flash model with "Thinking" capabilities to break down complex problems step-by-step, just like a real tutor.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-indigo-200">
            <span className="flex items-center gap-1">⚡ Fast Responses</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
            <span className="flex items-center gap-1">🧠 Deep Reasoning</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
            <span className="flex items-center gap-1">🌐 Live Search</span>
          </div>
        </div>
        {/* Abstract decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Home;
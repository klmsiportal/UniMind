import React from 'react';
import { Check, Crown, Zap, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Premium: React.FC = () => {
  const { user, upgradeToPremium } = useAuth();

  const handleManualVerification = () => {
    // In a real app, this would trigger a verification request
    alert("Please contact support with your payment receipt to activate Premium manually.");
    // Simulating instant upgrade for demo purposes since we don't have a real backend callback
    upgradeToPremium();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="text-center space-y-4 mb-10 py-10">
        <div className="inline-block p-3 rounded-full bg-yellow-500/10 mb-2">
            <Crown className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Upgrade to <span className="gold-gradient">UniMind Premium</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Unlock unlimited Deep Reasoning, prioritized processing, and exclusive access to advanced university databases.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Features Card */}
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Premium Benefits
          </h2>
          <ul className="space-y-4">
            {[
              "Unlimited Deep Solve (Reasoning Mode)",
              "Priority Access during peak hours",
              "Advanced Step-by-Step Explanations",
              "Ad-free Experience",
              "Verified Academic Sources"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-1 rounded-full">
                    <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-200">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Card */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 border-2 border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
            BEST VALUE
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Lifetime Access</h2>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-bold text-white">$4.99</span>
            <span className="text-slate-500 mb-1">/ one-time</span>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-yellow-500/20 text-yellow-500 p-1.5 rounded-lg text-xs font-bold">MOMO</span>
                <span className="text-sm font-semibold text-slate-300">Mobile Money</span>
              </div>
              <p className="font-mono text-lg tracking-wider text-white">+231 889 183 557</p>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg text-xs font-bold">BANK</span>
                <span className="text-sm font-semibold text-slate-300">United Bank Of Africa (Liberia)</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Account Number:</p>
                <p className="font-mono text-lg tracking-wider text-white">530 207 100 153 94</p>
                <p className="text-sm text-slate-400 mt-2">Account Name:</p>
                <p className="font-medium text-white">Akin S. Sokpah</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleManualVerification}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
               user?.isPremium 
               ? 'bg-emerald-600 text-white cursor-default'
               : 'gold-bg text-black shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40'
            }`}
            disabled={user?.isPremium}
          >
            {user?.isPremium ? 'Premium Active' : 'I Have Made Payment'}
          </button>
          
          {!user?.isPremium && (
             <p className="text-xs text-center text-slate-500 mt-4">
               Click the button above after sending payment to instantly activate via manual verification simulation.
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium;
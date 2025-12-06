import React from 'react';
import { Check, Crown, Zap, Shield, Sparkles, Smartphone, Building2 } from 'lucide-react';
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
      <div className="text-center space-y-4 mb-10 py-10 relative">
        <div className="inline-block p-4 rounded-full bg-yellow-500/10 mb-2 ring-1 ring-yellow-500/30">
            <Crown className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Upgrade to <span className="gold-gradient">UniMind Premium</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Unlock the full power of AI with unlimited Deep Reasoning, prioritized processing, and exclusive academic tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
        {/* Features Card */}
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 h-fit shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Why Go Premium?
          </h2>
          <ul className="space-y-6">
            {[
              { text: "Unlimited Deep Solve (Reasoning Mode)", sub: "Advanced multi-step logic for complex problems" },
              { text: "Priority Server Access", sub: "Skip the line during peak hours" },
              { text: "Detailed Explanations", sub: "Step-by-step breakdowns of every answer" },
              { text: "Verified Academic Sources", sub: "Citations from trusted university databases" },
              { text: "Voice Mode (TTS)", sub: "Listen to solutions on the go" }
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg mt-1">
                    <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <span className="block text-lg font-medium text-slate-200">{feature.text}</span>
                    <span className="text-sm text-slate-500">{feature.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Card */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-1 border border-slate-700 shadow-2xl relative">
            <div className="bg-slate-900 rounded-[22px] p-8 h-full">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-lg">
                    LIFETIME ACCESS
                </div>
                
                <h2 className="text-3xl font-bold mb-2 text-white">Pro Plan</h2>
                <div className="flex items-end gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-white tracking-tighter">$4.99</span>
                    <span className="text-slate-500 mb-1 font-medium">/ one-time</span>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <Smartphone className="w-5 h-5 text-yellow-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Mobile Money</span>
                        </div>
                        <p className="font-mono text-xl tracking-wider text-white font-bold pl-2">+231 889 183 557</p>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">United Bank of Africa</span>
                        </div>
                        <div className="space-y-3 pl-2">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Account Number</p>
                                <p className="font-mono text-xl tracking-wider text-white font-bold">530 207 100 153 94</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold">Account Name</p>
                                <p className="font-medium text-white text-lg">Akin S. Sokpah</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleManualVerification}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl ${
                    user?.isPremium 
                    ? 'bg-emerald-600 text-white cursor-default hover:scale-100'
                    : 'gold-bg text-black shadow-yellow-500/20 hover:shadow-yellow-500/40'
                    }`}
                    disabled={user?.isPremium}
                >
                    {user?.isPremium ? 'Premium Active ✅' : 'I Have Made Payment'}
                </button>
                
                {!user?.isPremium && (
                    <p className="text-xs text-center text-slate-500 mt-6 leading-relaxed">
                    Verification is usually instant. If you encounter any issues, please contact our support team.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
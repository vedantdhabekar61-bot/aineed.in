import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, Sparkles, Lock, Command } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface HeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  session: Session | null;
  onOpenAuth: () => void;
}

const TIPS = [
  "I want to create marketing emails...",
  "How can I generate code for a website?",
  "I need a logo for my coffee shop...",
  "Summarize this 50-page PDF...",
  "Create a voiceover for my video...",
];

const Hero: React.FC<HeroProps> = ({ onSearch, isSearching, session, onOpenAuth }) => {
  const [localQuery, setLocalQuery] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (session && localQuery.trim()) {
      onSearch(localQuery);
    } else if (!session) {
      onOpenAuth();
    }
  }, [localQuery, onSearch, session, onOpenAuth]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (session && localQuery.trim()) {
        onSearch(localQuery);
      } else if (!session) {
        onOpenAuth();
      }
    }
  }, [localQuery, onSearch, session, onOpenAuth]);

  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Mesh Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/50 blur-[100px] rounded-full -z-20 pointer-events-none opacity-60 mix-blend-multiply" />
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-purple-100/40 blur-[90px] rounded-full -z-20 pointer-events-none opacity-50 mix-blend-multiply" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-pink-100/40 blur-[80px] rounded-full -z-20 pointer-events-none opacity-50 mix-blend-multiply" />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-100 bg-white/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-8 shadow-sm ring-1 ring-white/50">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 fill-indigo-100" />
            Powered by Gemini 2.0 Flash
            </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Find the perfect <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient">AI Tool</span> for any task.
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-slate-500 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Describe your workflow, problem, or idea in plain English. We'll instantly match you with the best tools from our curated database.
        </p>

        <div className="w-full max-w-2xl relative group animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            
            <form onSubmit={handleSubmit} 
                className={`
                    relative bg-white rounded-3xl transition-all duration-300
                    ${isFocused ? 'ring-4 ring-indigo-500/10 shadow-2xl shadow-indigo-500/20 scale-[1.01]' : 'shadow-xl shadow-slate-200/60 ring-1 ring-slate-200'}
                `}
            >
                <div className="relative">
                    <div className="absolute top-5 left-5 text-slate-400">
                        <Command className="w-5 h-5" />
                    </div>
                    <textarea
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Describe what you want to do..."
                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 pl-14 pr-6 py-5 text-lg focus:outline-none resize-none min-h-[120px] rounded-t-3xl"
                    />
                </div>

                <div className="bg-white/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center rounded-b-3xl border-t border-slate-50">
                    <div className="flex items-center text-sm text-slate-400 px-2 overflow-hidden h-6 w-full max-w-[60%]">
                        <span className="mr-2 font-medium shrink-0">Try:</span>
                        <div className="relative h-6 w-full">
                            {TIPS.map((tip, idx) => (
                                <span 
                                    key={idx}
                                    className={`absolute left-0 top-0 whitespace-nowrap transition-all duration-500 ${
                                        idx === tipIndex 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-4'
                                    }`}
                                >
                                    "{tip}"
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {session ? (
                      <button 
                          type="submit"
                          disabled={isSearching || !localQuery.trim()}
                          className={`
                              inline-flex items-center px-6 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-lg transition-all duration-300
                              ${isSearching || !localQuery.trim() 
                                  ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' 
                                  : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95'}
                          `}
                      >
                          {isSearching ? (
                              <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Thinking...
                              </>
                          ) : (
                              <>
                                  <Search className="w-4 h-4 mr-2" />
                                  Find Tools
                              </>
                          )}
                      </button>
                    ) : (
                      <button 
                          type="button"
                          onClick={onOpenAuth}
                          className="inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md transition-all bg-slate-800 hover:bg-slate-700 active:scale-95"
                      >
                          <Lock className="w-3.5 h-3.5 mr-2" />
                          Sign in to search
                      </button>
                    )}
                </div>
            </form>
        </div>
    </section>
  );
};

export default Hero;
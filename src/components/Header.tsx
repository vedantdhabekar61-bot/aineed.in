import React, { useState, useEffect } from 'react';
import { Sparkles, Github, LogOut, User } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface HeaderProps {
  session: Session | null;
  onOpenAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, onOpenAuth }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            aineed.in
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {['Categories', 'Latest Tools', 'Submit'].map((item) => (
            <a 
              key={item}
              href="#" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
           <button className="text-slate-400 hover:text-slate-900 transition-colors hidden sm:block p-2 hover:bg-slate-100 rounded-full">
              <Github className="w-5 h-5" />
           </button>
           
           <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

           {session ? (
             <button 
               onClick={handleSignOut}
               className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-4 py-2 rounded-full hover:bg-slate-50 border border-transparent"
             >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
             </button>
           ) : (
             <button 
               onClick={onOpenAuth}
               className="group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
             >
                <User className="w-4 h-4 group-hover:text-white transition-colors" />
                <span>Sign In</span>
             </button>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;
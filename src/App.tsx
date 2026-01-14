import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolGrid from './components/ToolGrid';
import AuthModal from './components/AuthModal';
import { AiTool } from './types';
import { INITIAL_TOOLS } from './constants';
import { searchAiTools } from './services/geminiService';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [tools, setTools] = useState<AiTool[]>(INITIAL_TOOLS);
  const [isSearching, setIsSearching] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');
  
  // Auth State - Strictly typed
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (query: string) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsSearching(true);
    setLastQuery(query);
    try {
      const results = await searchAiTools(query);
      setTools(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        session={session} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
      />
      
      <main>
        <Hero 
          onSearch={handleSearch} 
          isSearching={isSearching} 
          session={session}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        
        <ToolGrid 
            tools={tools} 
            loading={isSearching}
            title={lastQuery ? `Results for "${lastQuery.length > 40 ? lastQuery.substring(0, 40) + '...' : lastQuery}"` : "Popular AI Tools"} 
        />
      </main>

      <footer className="border-t border-slate-200 mt-20 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AiFinder. Powered by Google Gemini.</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default App;
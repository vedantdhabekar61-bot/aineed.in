import React from 'react';
import ToolCard from './ToolCard';
import { AiTool } from '../types';

interface ToolGridProps {
  tools: AiTool[];
  title?: string;
  loading?: boolean;
}

const ShimmerCard = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 h-[300px] flex flex-col relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-50/50 to-transparent" />
    <div className="flex justify-between mb-5">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
      <div className="w-20 h-6 bg-slate-100 rounded-full" />
    </div>
    <div className="w-3/4 h-6 bg-slate-100 rounded-lg mb-4" />
    <div className="w-full h-4 bg-slate-50 rounded-lg mb-2" />
    <div className="w-full h-4 bg-slate-50 rounded-lg mb-2" />
    <div className="w-2/3 h-4 bg-slate-50 rounded-lg mb-auto" />
    <div className="w-full h-12 bg-slate-100 rounded-xl mt-6" />
  </div>
);

const ToolGrid: React.FC<ToolGridProps> = ({ tools, title, loading = false }) => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {title && (
        <div className="flex items-center mb-10 animate-[fade-in_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-grow ml-6"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ShimmerCard key={i} />)
        ) : (
          tools.map((tool) => (
            <div key={tool.id} className="animate-[fade-in_0.5s_ease-out]">
               <ToolCard tool={tool} />
            </div>
          ))
        )}
      </div>
      
      {!loading && tools.length === 0 && (
          <div className="text-center py-24 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-400 text-lg">No tools found matching your criteria.</p>
          </div>
      )}
    </section>
  );
};

export default ToolGrid;
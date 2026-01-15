import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { AiTool } from '../types';

interface ToolCardProps {
  tool: AiTool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="group relative bg-white rounded-3xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 h-full">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      <div className="bg-white rounded-[20px] p-6 h-full flex flex-col border border-slate-100 group-hover:border-transparent transition-colors relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50 transition-colors" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
              <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-600">
                {tool.name.charAt(0)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              {tool.category}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
            {tool.name}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
            {tool.description}
          </p>

          <a 
            href={tool.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-5 py-3 bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white text-sm font-semibold rounded-xl transition-all group-hover:shadow-lg"
          >
            Visit Website
            <div className="relative w-4 h-4">
               <ExternalLink className="absolute inset-0 w-4 h-4 transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:translate-x-2" />
               <ArrowRight className="absolute inset-0 w-4 h-4 transition-all duration-300 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
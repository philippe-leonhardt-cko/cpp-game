import React from 'react';
import { ProjectConfig, ProjectState, Transaction } from '../types';
import { PROJECTS, getQuarterlyYield } from '../constants';
import { Check, X, AlertOctagon, History, FileText } from 'lucide-react';

interface AuditViewProps {
  transactions: Transaction[];
  completedProjects: Record<string, boolean>;
  onToggleComplete: (projectId: string) => void;
  penalties: number;
  onPenaltyChange: (amount: number) => void;
  projects: Record<string, ProjectState>;
  quarter: number;
  onViewArtifact: (projectId: string, stageId: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ 
  transactions, 
  completedProjects, 
  onToggleComplete, 
  penalties, 
  onPenaltyChange,
  projects,
  quarter,
  onViewArtifact
}) => {
  const grossYield = Object.keys(completedProjects).reduce((sum, id) => {
    return completedProjects[id] ? sum + getQuarterlyYield(id, quarter) : sum;
  }, 0);

  const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
  const finalScore = grossYield - totalCost - penalties;

  return (
    <div className="space-y-6 animate-fade-in pb-32 max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 className="text-2xl font-black text-yellow-500 uppercase italic mb-8 tracking-tighter leading-none">
          Scorecard
        </h3>

        <div className="mb-10">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block px-2">
            Products Built to Market Need
          </span>
          
          <div className="space-y-3">
            {Object.values(PROJECTS).map((p) => {
               const state = projects[p.id];
               if (state.isLocked) return null;
               const currentYield = getQuarterlyYield(p.id, quarter);
               const isCompleted = completedProjects[p.id];
               
               return (
                <div key={p.id} className="relative">
                  <div
                    onClick={() => onToggleComplete(p.id)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl transition-all ${isCompleted ? 'grayscale-0' : 'grayscale opacity-50'}`}>{p.icon}</span>
                      <div className="text-left">
                        <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isCompleted ? 'text-white' : 'text-slate-500'}`}>{p.name}</p>
                        <p className="text-[10px] font-bold opacity-60 text-slate-500 uppercase">
                          Yield: +{currentYield}
                        </p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${isCompleted ? 'bg-green-500' : 'bg-slate-800'}`}>
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${isCompleted ? 'translate-x-6' : 'translate-x-0'}`}>
                             {isCompleted ? (
                                <Check size={14} className="text-green-600 font-bold" strokeWidth={4} />
                             ) : (
                                <X size={14} className="text-red-500 font-bold" strokeWidth={4} />
                             )}
                        </div>
                    </div>
                  </div>
                  
                  {quarter == 4 && (
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewArtifact(p.id, 'audit');
                      }}
                      className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors p-2"
                      title="Check Correct Spec"
                     >
                       <FileText size={14} />
                     </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Penalty Management */}
        <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] mb-10">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <AlertOctagon className="text-red-500" size={16} />
              <h4 className="text-xs font-black text-red-500 uppercase tracking-widest italic">
                Regulatory Fines
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 font-bold max-w-[200px] leading-tight">
              Deduct 200 pts for every violation of the rules.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-white/5">
            <button
              onClick={() => onPenaltyChange(-200)}
              className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-lg"
            >
              -
            </button>
            <span className="text-2xl font-black text-red-500 tabular-nums min-w-[60px] text-center">
              -{penalties}
            </span>
            <button
              onClick={() => onPenaltyChange(200)}
              className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Transaction Log */}
        <div className="bg-slate-950 p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-slate-500" size={14} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              R&D Burn Log
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
            {transactions.length === 0 ? (
              <p className="text-[10px] text-slate-700 italic">No discovery transactions recorded.</p>
            ) : (
              transactions.slice().reverse().map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2 last:border-0"
                >
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-black">Q{t.quarter}</span>
                    <span className="text-slate-300 font-bold">{t.project}</span>
                    <span className="text-slate-500">({t.stage})</span>
                  </div>
                  <span className="text-red-500 font-black">-{t.cost}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* P&L Dashboard */}
      <div className="bg-slate-950 border-4 border-slate-900 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-20" />

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-slate-900/50 rounded-2xl">
            <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">
              Gross Yield
            </span>
            <span className="text-xl font-black text-white">+{grossYield}</span>
          </div>
          <div className="text-center p-4 bg-slate-900/50 rounded-2xl">
            <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">
              R&D Costs
            </span>
            <span className="text-xl font-black text-red-500">-{totalCost}</span>
          </div>
          <div className="text-center p-4 bg-slate-900/50 rounded-2xl">
            <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">
              Regulatory
            </span>
            <span className="text-xl font-black text-red-500">-{penalties}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">
            Consolidated Market Yield
          </p>
          <div
            className={`text-[5rem] sm:text-[7rem] font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl ${
              finalScore < 0 ? 'text-red-500' : 'text-white'
            }`}
          >
            {finalScore}
          </div>
          <p className="text-[9px] text-slate-800 font-black uppercase mt-10 tracking-widest italic opacity-50">
            Audited Portfolio Engine v4.2
          </p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { ProjectConfig, ProjectState, DiscoveryStage } from '../types';
import { getQuarterlyYield } from '../constants';
import { Lock, Clock, AlertTriangle, FileText, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProjectCardProps {
  config: ProjectConfig;
  state: ProjectState;
  quarter: number;
  onStartStage: (projectId: string, stageIndex: number) => void;
  onViewArtifact: (projectId: string, stageId: string) => void;
  allProjects: Record<string, ProjectState>;
  stages: DiscoveryStage[];
  isDemoMode: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ config, state, quarter, onStartStage, onViewArtifact, allProjects, stages: STAGES, isDemoMode }) => {
  // Identify the currently active stage if any
  const isComplete = state.completedStages.length === STAGES.length;
  
  // Calculate global commercial discoveries count
  let globalCommercialCount = 0;
  Object.keys(allProjects).forEach(key => {
    const proj = allProjects[key];
    proj.activeStages.forEach((timer, stageIdx) => {
      const stage = STAGES[stageIdx];
      if (stage && stage.type === 'comm') {
        globalCommercialCount++;
      }
    });
  });
  
  // Check if we need to show the Stop Work alert (Product or Validation phases)
  let showStopWorkAlert = false;
  state.activeStages.forEach((timer, stageIdx) => {
    const activeStage = STAGES[stageIdx];
    if (activeStage && (activeStage.type === 'prod' || activeStage.type === 'val')) {
      showStopWorkAlert = true;
    }
  });

  const currentYield = getQuarterlyYield(config.id, quarter, isDemoMode);
  const previousYield = quarter > 1 ? getQuarterlyYield(config.id, quarter - 1, isDemoMode) : currentYield;
  
  // Determine trend
  let trendIcon = <Minus size={12} className="text-slate-500" />;
  let trendClass = 'text-slate-400';
  if (currentYield > previousYield) {
    trendIcon = <TrendingUp size={12} className="text-green-500" />;
    trendClass = 'text-green-500';
  } else if (currentYield < previousYield) {
    trendIcon = <TrendingDown size={12} className="text-red-500" />;
    trendClass = 'text-red-500';
  }

  if (state.isLocked) {
    return (
      <div className={`relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-6 opacity-60 grayscale`}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center text-slate-500">
            <Lock className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Locked until a later quarter</span>
          </div>
        </div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-6xl filter blur-sm">{config.icon}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] bg-slate-900 border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${config.color} ${isComplete ? 'border-green-500/50 shadow-green-900/20' : ''}`}>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <span className="text-6xl drop-shadow-xl select-none">{config.icon}</span>
            {showStopWorkAlert && (
              <div className="mt-1 bg-red-500/10 border border-red-500 text-red-500 px-3 py-2 rounded-xl animate-pulse flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <AlertTriangle size={16} className="animate-bounce" />
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Stop Work</span>
                    <span className="text-[8px] font-bold opacity-75 leading-none mt-0.5">Product Discovery Underway</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Q{quarter} Yield</span>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-black tabular-nums transition-colors duration-500 ${trendClass}`}>+{currentYield}</span>
              {quarter > 1 && trendIcon}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black mb-1 italic tracking-tight text-white">{config.name}</h3>
        <p className="text-[12px] text-slate-500 font-black mb-8 uppercase tracking-widest">{config.bricks} Bricks Required</p>


        {/* Stages Grid */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-3 gap-2">
            {STAGES.map((stage, idx) => {
              const isDone = state.completedStages.includes(idx);
              const isCommercial = stage.type === 'comm';
              
              // Check if there's an active product/validation stage (blocks other product/validation stages)
              let hasActiveProdOrVal = false;
              state.activeStages.forEach((timer, stageIdx) => {
                const activeStage = STAGES[stageIdx];
                if (activeStage && activeStage.type === 'prod') {
                  hasActiveProdOrVal = true;
                }
              });
              
              // Product/validation stages are blocked by other product/validation stages
              // Commercial stages are never blocked
              const isBlockedByActiveProdOrVal = !isCommercial && hasActiveProdOrVal;
              
              // Commercial discoveries are blocked if we've reached the global limit of 3
              const isBlockedByCommercialLimit = isCommercial && globalCommercialCount >= 3;
              
              // Disable p2 if p1 is not completed
              const p1Index = STAGES.findIndex(s => s.id === 'p1');
              const isP1Completed = state.completedStages.includes(p1Index);
              const requiresP1 = stage.id === 'p2' && !isP1Completed;
              
              const isClickable = !isDone && !isBlockedByActiveProdOrVal && !isBlockedByCommercialLimit && !requiresP1;
              const isThisStageActive = state.activeStages.has(idx);

              let btnColor = 'border-slate-800 bg-slate-900/50 text-slate-600';
              if (isDone) btnColor = 'border-green-500/30 bg-green-500/10 text-green-500';
              else if (isThisStageActive) btnColor = 'border-yellow-500 bg-slate-800 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
              else if (isClickable) btnColor = 'border-white/20 bg-slate-800 hover:border-yellow-500 text-slate-300 hover:text-white cursor-pointer';
              else btnColor = 'border-slate-800 bg-slate-900/30 text-slate-700'; // Busy state for other buttons

              if (stage.type === 'prod' && !isDone && !isThisStageActive && isClickable) {
                 btnColor = 'border-white/20 bg-slate-800 hover:border-red-500 hover:text-red-400 text-slate-300 cursor-pointer';
              }

              // 1. Configuration
const validationQuarters = [3, 4];
const validationProjects = ['tower', 'table', 'bridge'];

// 2. Validation Logic (Stage v1)
// Must be v1 AND (Q3 or Q4) AND (Tower, Table, or Bridge)
const isValidV1 = 
  stage.id === 'v1' && 
  validationQuarters.includes(quarter) && 
  validationProjects.includes(config.id);

// 3. New Product Discovery Logic (Stage p3)
// Must be p3 AND Q4 AND Tower AND v1 completed
const v1Index = STAGES.findIndex(s => s.id === 'v1');
const isV1Completed = state.completedStages.includes(v1Index);
const isValidP3 = 
  stage.id === 'p3' && 
  quarter === 4 && 
  config.id === 'tower' &&
  isV1Completed;

// 4. Hide p2 on Tower if v1 is completed but p2 is not done
const p2Index = STAGES.findIndex(s => s.id === 'p2');
const isP2Done = state.completedStages.includes(p2Index);
const hideP2OnTower = 
  stage.id === 'p2' && 
  config.id === 'tower' && 
  isV1Completed && 
  !isP2Done;

// 5. Final Visibility Check
// Show if it's a valid v1, a valid p3, or if it's any other stage 
// (assuming other stages like p1, p2 should always show)
// But hide p2 on Tower if v1 is done and p2 was skipped
const shouldShow = (isValidV1 || isValidP3 || (stage.id !== 'v1' && stage.id !== 'p3')) && !hideP2OnTower;

              // 3. Only return the button if conditions are met
              if (!shouldShow) return null;
              
              // Check if this specific stage is active
              const thisStageTimer = state.activeStages.get(idx);
              const isStageRunning = thisStageTimer !== undefined;

              return (
                <button
                  key={stage.id}
                  disabled={!isClickable}
                  onClick={() => onStartStage(config.id, idx)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all h-[60px] ${btnColor}`}
                >
                  {isStageRunning ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="flex items-center gap-1 mb-0.5">
                           <Clock className="w-3 h-3 animate-spin text-yellow-500" />
                           <span className="text-lg font-mono font-bold text-white tabular-nums leading-none">{thisStageTimer}s</span>
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-wider text-yellow-500">Discovering</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[12px] font-black uppercase mb-1 leading-none">{stage.label}</span>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <>
                          <span className={`text-[14px] font-black leading-none ${stage.type === 'prod' ? 'text-red-500' : 'text-blue-400'}`}>
                            -{stage.cost}
                          </span>
                          <span className="text-xs font-bold opacity-50 mt-1 leading-none">{stage.duration}s</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Log */}
        <div className="bg-slate-950 p-5 rounded-3xl min-h-[140px] shadow-inner border border-white/5 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Discovery Log</span>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[120px] scrollbar-hide">
            {state.unlockedLogs.length === 0 ? (
              <p className="text-[10px] text-slate-700 italic font-medium">No intel gathered. Initialize discovery sequence...</p>
            ) : (
              state.unlockedLogs.map((logEntry, i) => {
                const stageForLog = STAGES[logEntry.stageIndex];
                
                const hasArtifact = stageForLog && (
                  (config.id === 'fish' && ['c1', 'c3' ,'p1', 'p2'].includes(stageForLog.id)) ||
                  (config.id === 'tower' && ['p3'].includes(stageForLog.id)) ||
                  (stageForLog.id === 'p2')
                );

                return (
                  <div key={i} className="flex gap-2 items-start animate-fade-in group">
                    <span className="text-yellow-500 mt-0.5 min-w-[12px]"><CheckCircle size={12} /></span>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-300 font-medium leading-tight">{logEntry.text}</p>
                      {hasArtifact && (
                        <button 
                          onClick={() => onViewArtifact(config.id, stageForLog.id)}
                          className="mt-1 flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 uppercase font-black tracking-wider border border-blue-500/30 rounded px-2 py-0.5 hover:bg-blue-500/10 transition-colors"
                        >
                          <FileText size={8} />
                          View Spec
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
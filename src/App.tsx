import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getProjects, getStages, getIntelligenceLogs, STAGE_IMAGES, getQuarterlyYield } from './constants';
import { ProjectState, Transaction, ProjectId } from './types';
import { ProjectCard } from './components/ProjectCard';
import { AuditView } from './components/AuditView';
import { ImageModal } from './components/ImageModal';
import { Zap, Info, Shield, Siren } from 'lucide-react';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [quarter, setQuarter] = useState(1);
  const [view, setView] = useState<'pipeline' | 'audit'>('pipeline');
  
  // Compute initial project state based on mode
  const getInitialProjectState = (demoMode: boolean): Record<string, ProjectState> => {
    const projects = getProjects(demoMode);
    const state: Record<string, ProjectState> = {};
    Object.keys(projects).forEach(key => {
      state[key] = {
        id: key as ProjectId,
        completedStages: [],
        activeStageIndex: null,
        activeStages: new Map(),
        timerRemaining: 0,
        unlockedLogs: [],
        isLocked: projects[key].lockedUntilQuarter ? true : false,
      };
    });
    return state;
  };
  
  const [projects, setProjects] = useState<Record<string, ProjectState>>(() => getInitialProjectState(false));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});
  const [penalties, setPenalties] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');

  // Audio Refs
  const sirenRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  // Get data based on current mode
  const PROJECTS = useMemo(() => getProjects(isDemoMode), [isDemoMode]);
  const STAGES = useMemo(() => getStages(isDemoMode), [isDemoMode]);
  const INTELLIGENCE_LOGS = useMemo(() => getIntelligenceLogs(isDemoMode), [isDemoMode]);

  // Initialize Audio
  useEffect(() => {
    sirenRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/emergency_it_is_an_emergency.ogg");
    sirenRef.current.loop = true;
    chimeRef.current = new Audio("https://actions.google.com/sounds/v1/foley/beeps_uiselect.ogg");
  }, []);

  // Handle mode selection and start
  const handleStart = (demoMode: boolean) => {
    setIsDemoMode(demoMode);
    setProjects(getInitialProjectState(demoMode));
    setTransactions([]);
    setCompletedProjects({});
    setPenalties(0);
    setQuarter(1);
    setHasStarted(true);
  };

  // Unlock logic based on Quarter
  useEffect(() => {
    setProjects(prev => {
      const next = { ...prev };
      Object.keys(PROJECTS).forEach(key => {
        const config = PROJECTS[key];
        if (config.lockedUntilQuarter && quarter >= config.lockedUntilQuarter) {
          next[key].isLocked = false;
        } else if (config.lockedUntilQuarter && quarter < config.lockedUntilQuarter) {
          next[key].isLocked = true;
        }
      });
      return next;
    });
  }, [quarter]);

  // Timer Tick
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      let isAnyHighStakes = false;

      setProjects(prev => {
        let hasGlobalChange = false;
        const next: Record<string, ProjectState> = {};

        Object.keys(prev).forEach(key => {
          const p = prev[key as ProjectId];
          
          // Skip if no active stages
          if (p.activeStages.size === 0) {
            next[key] = p;
            return;
          }
          
          // Process all active stages - create new Map to ensure React detects changes
          const newActiveStages = new Map<number, number>();
          const completedStageIndices: number[] = [];
          let hasProjectChange = false;
          
          p.activeStages.forEach((timeRemaining, stageIndex) => {
            if (timeRemaining > 0) {
              const newTime = timeRemaining - 1;
              
              if (newTime > 0) {
                // Still counting down
                newActiveStages.set(stageIndex, newTime);
                hasProjectChange = true;

                // Check if this is a high stakes wait for siren logic
                const currentStage = STAGES[stageIndex];
                if (currentStage && (currentStage.type === 'prod' || currentStage.type === 'val')) {
                  isAnyHighStakes = true;
                }
              } else {
                // Stage Complete (timer reached 0)
                completedStageIndices.push(stageIndex);
                hasProjectChange = true;
              }
            }
          });
          
          // Only create new project object if there were changes
          if (hasProjectChange) {
            hasGlobalChange = true;
            
            // Create new project state
            const newProject = { ...p };
            newProject.activeStages = newActiveStages;
            
            // Process completed stages
            if (completedStageIndices.length > 0) {
              newProject.completedStages = [...p.completedStages];
              newProject.unlockedLogs = [...p.unlockedLogs];
              
              completedStageIndices.forEach(completedIndex => {
                // Add to completed list if not already there
                if (!newProject.completedStages.includes(completedIndex)) {
                  newProject.completedStages.push(completedIndex);
                }

                // Unlock Intel
                const intelText = INTELLIGENCE_LOGS[key] ? INTELLIGENCE_LOGS[key][completedIndex] : "Data corrupted...";
                if (intelText) {
                  // Prepend new log
                  newProject.unlockedLogs.unshift({ text: intelText, stageIndex: completedIndex });
                }

                chimeRef.current?.play().catch(() => {});
              });
            }
            
            // Update legacy fields for compatibility
            if (newProject.activeStages.size > 0) {
              // Find the first prod/val stage, or just the first stage
              let prodOrValStage: { idx: number; timer: number } | null = null;
              for (const [idx, timer] of newProject.activeStages.entries()) {
                const stage = STAGES[idx];
                if (stage && stage.type === 'prod') {
                  prodOrValStage = { idx, timer };
                  break;
                }
              }
              if (!prodOrValStage && newProject.activeStages.size > 0) {
                const firstEntry = newProject.activeStages.entries().next().value;
                if (firstEntry) {
                  const [idx, timer] = firstEntry as [number, number];
                  prodOrValStage = { idx, timer };
                }
              }
              if (prodOrValStage) {
                newProject.activeStageIndex = prodOrValStage.idx;
                newProject.timerRemaining = prodOrValStage.timer;
              }
            } else {
              newProject.activeStageIndex = null;
              newProject.timerRemaining = 0;
            }
            
            next[key] = newProject;
          } else {
            next[key] = p;
          }
        });

        return hasGlobalChange ? next : prev;
      });

      // Audio Management
      if (isAnyHighStakes) {
        sirenRef.current?.play().catch(() => {});
      } else {
        sirenRef.current?.pause();
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, STAGES, INTELLIGENCE_LOGS]);

  const handleStartStage = (projectId: string, stageIndex: number) => {
    const stage = STAGES[stageIndex];
    if (!stage) return;

    const currentProjectState = projects[projectId];
    
    // Prevent starting if already active in this project's active stages, or if locked
    if (currentProjectState.activeStages.has(stageIndex) || currentProjectState.isLocked) return;

    // Record Transaction
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      quarter,
      project: PROJECTS[projectId].name,
      stage: stage.label,
      cost: stage.cost,
      timestamp: Date.now()
    };
    setTransactions(prev => [...prev, newTx]);

    // Start Project Timer - add to active stages
    setProjects(prev => {
      const newActiveStages = new Map(prev[projectId].activeStages);
      newActiveStages.set(stageIndex, stage.duration);
      
      return {
        ...prev,
        [projectId]: {
          ...prev[projectId],
          activeStages: newActiveStages,
          activeStageIndex: stageIndex, // Keep for backward compatibility
          timerRemaining: stage.duration // Keep for backward compatibility
        }
      };
    });
  };

  const handleViewArtifact = (projectId: string, stageId: string) => {
    const key = `${projectId}_${stageId}`;
    const image = STAGE_IMAGES[key];
    if (image) {
      setCurrentImage(image);
      setModalTitle(`${PROJECTS[projectId].name} - ${stageId.toUpperCase()} Artifact`);
      setModalOpen(true);
    }
  };

  // Score Calculation for header
  const grossYield = Object.keys(completedProjects).reduce((sum, id) => {
    return completedProjects[id] ? sum + getQuarterlyYield(id, quarter, isDemoMode) : sum;
  }, 0);
  const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
  const currentScore = grossYield - totalCost - penalties;

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-yellow-500 rounded-3xl mb-12 flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-bounce">
            <span className="text-5xl">🏗️</span>
            </div>
            <h1 className="text-6xl font-black text-white uppercase italic mb-6 tracking-tighter leading-none">CPP Roadmap Simulation</h1>
            <p className="text-slate-400 max-w-md mb-10 text-lg font-mono">Discover. Build. Pivot.</p>
            <div className="flex gap-4">
                <button 
                    onClick={() => handleStart(false)} 
                    className="group relative px-16 py-6 bg-yellow-500 text-slate-950 font-black rounded-3xl text-3xl hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative">Start</span>
                </button>
                <button 
                    onClick={() => handleStart(true)} 
                    className="group relative px-12 py-6 bg-slate-800 text-slate-300 font-black rounded-3xl text-lg hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest overflow-hidden border border-slate-700"
                >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center gap-2">
                        <span className="text-2xl">🍌</span>
                        Demo
                    </span>
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-7xl mx-auto selection:bg-yellow-500 selection:text-slate-950">
      <ImageModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        image={currentImage} 
        title={modalTitle} 
      />

      {/* Header */}
      <header className="sticky top-0 z-[50] bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center px-6 lg:px-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2.5 rounded-xl text-slate-900 shadow-lg">
            <Zap size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase text-white tracking-tighter italic leading-none">Commercial Product Partnerships</h1>
              {isDemoMode && (
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 text-[9px] font-black uppercase tracking-widest rounded">
                  Demo
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Roadmap Simulation</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Current Quarter</span>
                <span className="text-xl font-bold text-yellow-500">Q{quarter}</span>
            </div>
            <div className="hidden lg:flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300">
                        {(() => {
                            let count = 0;
                            Object.keys(projects).forEach(key => {
                                const proj = projects[key];
                                proj.activeStages.forEach((timer, idx) => {
                                    if (STAGES[idx]?.type === 'comm') count++;
                                });
                            });
                            return count;
                        })()}/3 <span className="text-slate-500">Commercial</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300">
                        {(() => {
                            let count = 0;
                            Object.keys(projects).forEach(key => {
                                const proj = projects[key];
                                proj.activeStages.forEach((timer, idx) => {
                                    if (STAGES[idx]?.type === 'prod') count++;
                                });
                            });
                            return count;
                        })()} <span className="text-slate-500">Product</span>
                    </span>
                </div>
            </div>
            <div className="bg-slate-950 px-8 py-2 rounded-2xl border border-white/10 text-center flex flex-col shadow-inner min-w-[140px]">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Score</span>
            <span className={`text-3xl font-black tabular-nums ${currentScore < 0 ? 'text-red-500' : 'text-green-400'}`}>
                {currentScore > 0 ? '+' : ''}{currentScore}
            </span>
            </div>
        </div>
      </header>

      {/* Navigation & Controls */}
      <div className="px-6 lg:px-8 pt-6 pb-4 space-y-4">
        {/* Quarter Selector */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-lg overflow-x-auto gap-2">
            {[1, 2, 3, 4].map(q => (
            <button 
                key={q} 
                onClick={() => setQuarter(q)} 
                className={`flex-1 py-3 px-4 min-w-[100px] text-xs font-black uppercase transition-all rounded-xl border ${quarter === q ? 'bg-slate-800 text-yellow-500 border-yellow-500/50 shadow-lg scale-[1.02]' : 'text-slate-600 border-transparent hover:text-slate-400 hover:bg-slate-800/50'}`}
            >
                Q{q}
            </button>
            ))}
        </div>

        {/* Info Banner */}
        {(quarter != 1 && !isDemoMode) &&
        <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${quarter === 3 ? 'bg-red-500/10 border-red-500/50 animate-pulse-border' : 'bg-blue-500/5 border-blue-500/20'}`}>
            <div className={`${quarter === 3 ? 'text-red-500' : 'text-blue-400'}`}>
                {quarter === 3 ? <Shield className="animate-pulse" /> : <Info />}
            </div>
            <p className="text-sm font-bold text-slate-300 leading-snug">
                {quarter === 2 && "Market Update: The pipeline has changed."}
                {quarter === 3 && "NEW REGULATION: Any brick cannot touch more than 4 other non-yellow bricks. If bricks don't touch they must be at least 2 studs apart."}
                {quarter === 4 && "Market Update: A new product skyrockets in popularity. Merchants now want the 'Big Fish'."}
            </p>
        </div>
        }

        {/* View Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl gap-1 border border-white/5 shadow-lg w-full md:w-auto self-start inline-flex">
            <button onClick={() => setView('pipeline')} className={`px-8 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${view === 'pipeline' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                Market & Pipeline
            </button>
            <button onClick={() => setView('audit')} className={`px-8 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${view === 'audit' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                Profit & Loss
            </button>
        </div>
      </div>

      <main className="flex-1 px-6 lg:px-8 pb-12 overflow-y-auto scrollbar-hide">
        {view === 'pipeline' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-20">
                {Object.keys(PROJECTS).map(key => {
                    const proj = PROJECTS[key];
                    return (
                        <ProjectCard 
                            key={proj.id}
                            config={proj}
                            state={projects[proj.id]}
                            quarter={quarter}
                            onStartStage={handleStartStage}
                            onViewArtifact={handleViewArtifact}
                            allProjects={projects}
                            stages={STAGES}
                            isDemoMode={isDemoMode}
                        />
                    );
                })}
            </div>
        )}

        {view === 'audit' && (
            <AuditView 
                transactions={transactions}
                completedProjects={completedProjects}
                onToggleComplete={(id) => setCompletedProjects(prev => ({...prev, [id]: !prev[id]}))}
                penalties={penalties}
                onPenaltyChange={(val) => setPenalties(prev => Math.max(0, prev + val))}
                projects={projects}
                quarter={quarter}
                onViewArtifact={handleViewArtifact}
                projectConfigs={PROJECTS}
                isDemoMode={isDemoMode}
            />
        )}
      </main>

      <footer className="fixed bottom-0 w-full z-40 bg-slate-950/90 border-t border-white/5 p-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
            <div className="flex gap-4">
                <span>CPP Roadmap Simulation</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Built with ❤️ by Mohamed Essam and Philippe Leonhardt</span>
            </div>
            <span>v2.0.0</span>
        </div>
      </footer>
    </div>
  );
}
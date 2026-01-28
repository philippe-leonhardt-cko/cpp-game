export type ProjectId = 'tower' | 'table' | 'bridge' | 'fish';

export interface DiscoveryStage {
  id: string;
  label: string;
  type: 'comm' | 'prod' | 'val';
  cost: number;
  duration: number; // in seconds
  description: string;
  imageKey?: string; // Key to look up the image URL
}

export interface ProjectConfig {
  id: ProjectId;
  name: string;
  icon: string;
  bricks: number;
  yields: number[]; // Quarterly yields [Q1, Q2, Q3, Q4]
  description: string;
  color: string;
  lockedUntilQuarter?: number;
}

export interface ProjectState {
  id: ProjectId;
  completedStages: number[]; // Indices of stages that have been completed
  activeStageIndex: number | null; // Index of the stage currently in progress, if any (deprecated, kept for compatibility)
  activeStages: Map<number, number>; // Map of stageIndex -> timerRemaining for multiple parallel stages
  timerRemaining: number; // deprecated, kept for compatibility
  unlockedLogs: { text: string; stageIndex: number }[]; // Logs with their source stage
  isLocked: boolean;
}

export interface Transaction {
  id: string;
  quarter: number;
  project: string;
  stage: string;
  cost: number;
  timestamp: number;
}

export interface ImageAsset {
  key: string;
  url: string;
  alt: string;
}
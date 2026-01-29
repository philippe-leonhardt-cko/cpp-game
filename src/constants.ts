import { DiscoveryStage, ProjectConfig, ImageAsset } from './types';
import { IMAGES } from './images';

// Demo mode stages with reduced durations
export const DEMO_STAGES: DiscoveryStage[] = [
  { id: 'c1', label: 'Commercial', type: 'comm', cost: 100, duration: 3, description: 'Commercial Signal' },
  { id: 'c2', label: 'Commercial', type: 'comm', cost: 50, duration: 5, description: 'Commercial Signal' },
  { id: 'c3', label: 'Commercial', type: 'comm', cost: 25, duration: 8, description: 'Commercial Signal' },
  { id: 'p1', label: 'Product Draft', type: 'prod', cost: 200, duration: 10, description: 'Product Draft & Prototype', imageKey: '_draft' },
  { id: 'p2', label: 'Product Spec', type: 'prod', cost: 600, duration: 15, description: 'Final Product Specification', imageKey: '_final' },
];

// Normal mode stages
export const STAGES: DiscoveryStage[] = [
  { id: 'c1', label: 'Commercial', type: 'comm', cost: 100, duration: 30, description: 'Commercial Research' },
  { id: 'c2', label: 'Commercial', type: 'comm', cost: 50, duration: 60, description: 'Commercial Research' },
  { id: 'c3', label: 'Commercial', type: 'comm', cost: 25, duration: 120, description: 'Commercial Research' },
  { id: 'p1', label: 'Product Draft', type: 'prod', cost: 200, duration: 180, description: 'Product Draft & Prototype', imageKey: '_draft' },
  { id: 'p2', label: 'Product Spec', type: 'prod', cost: 600, duration: 360, description: 'Final Product Specification', imageKey: '_final' },
  { id: 'v1', label: 'Product Validation', type: 'prod', cost: 75, duration: 60, description: 'Market Validation' },
  { id: 'p3', label: 'Product Spec (New)', type: 'prod', cost: 300, duration: 180, description: 'NEW Final Product Specification', imageKey: '_final_new' },
];

// Helper to get stages based on mode
export const getStages = (isDemoMode: boolean): DiscoveryStage[] => {
  return isDemoMode ? DEMO_STAGES : STAGES;
};

// Demo mode project
export const DEMO_PROJECTS: Record<string, ProjectConfig> = {
  banana: {
    id: 'banana',
    name: 'The Banana',
    icon: '🍌',
    bricks: 20,
    yields: [1000, 1000, 1200, 1400],
    description: 'Demo Project',
    color: 'border-yellow-500/50',
  },
};

// Normal mode projects
export const PROJECTS: Record<string, ProjectConfig> = {
  tower: {
    id: 'tower',
    name: 'The Tower',
    icon: '🏯',
    bricks: 16,
    yields: [2000, 2400, 2800, 3000],
    description: 'Commercial Discovery',
    color: 'border-blue-500/50',
  },
  table: {
    id: 'table',
    name: 'The Table',
    icon: '🍽️',
    bricks: 8,
    yields: [2800, 1600, 800, 0],
    description: 'Commercial Discovery',
    color: 'border-amber-500/50',
  },
  bridge: {
    id: 'bridge',
    name: 'The Bridge',
    icon: '🌉',
    bricks: 8,
    yields: [1200, 1600, 1800, 1400],
    description: 'Commercial Discovery',
    color: 'border-emerald-500/50',
  },
  fish: {
    id: 'fish',
    name: 'The Big Fish',
    icon: '🐟',
    bricks: 14,
    yields: [0, 0, 0, 4000],
    description: 'Special Project',
    color: 'border-fuchsia-500/50',
    lockedUntilQuarter: 4,
  },
};

// Helper to get projects based on mode
export const getProjects = (isDemoMode: boolean): Record<string, ProjectConfig> => {
  return isDemoMode ? DEMO_PROJECTS : PROJECTS;
};

export const getQuarterlyYield = (projectId: string, quarter: number, isDemoMode: boolean = false): number => {
  const projects = isDemoMode ? DEMO_PROJECTS : PROJECTS;
  const project = projects[projectId];
  if (!project) return 0;
  // quarter is 1-based, array is 0-based
  return project.yields[Math.min(Math.max(0, quarter - 1), 3)] || 0;
};

// Demo mode intelligence logs
export const DEMO_INTELLIGENCE_LOGS: Record<string, string[]> = {
  banana: [
    "[COMMERCIAL] Focus groups indicate symmetrical curvature is best achieved with a 4x4 studs structure that is 9 bricks high. Then two bricks should be left for the tips.",
    "[COMMERCIAL] Market research shows yellow is the preferred color for authenticity. But needs one brown bit for a realistic touch.",
    "[COMMERCIAL] Customer feedback: We need the two tips to be attached by 2x4 stud connections for stability.",
    "[PRODUCT] Technical draft: Start with yellow. With 6 bricks, build a cube. The next 2 bricks are placed side-by-side on top of the cube with a 1-stud offset. Add 2 more levels with 2 bricks side-by-side with the same offset. You now have attached 3 slanted levels to the cube. Add the same slanted structure to the bottom of the cube for symmetry. Place the last yellow brick on top of the structure, only this time with a 2-stud offset in the direction of the curvature. Place a single brown brick to complete the symmetry.",
    "[PRODUCT] Technical blueprint:",
  ],
};

// Normal mode intelligence logs
export const INTELLIGENCE_LOGS: Record<string, string[]> = {
  tower: [
    "[COMMERCIAL] Market feedback: Clients want high-visibility Red towers with a square roof.",
    "[COMMERCIAL] ICP Demand: Specifications require an 8-level structure, exactly 2 bricks per level.",
    "[COMMERCIAL] Sustainability Ask: We need 'Planted Eco-Floors'. Start with a planted ground floor, then alternate every level.",
    "[PRODUCT] Technical Draft: 8-level stack with 2 bricks per level. Green base. Alternating Green/Red floors. The top is square.",
    "[PRODUCT] Technical Blueprint:",
    "[PRODUCT] Compliance Check: Q3 Regulatory audit warns of new 'ventilation' requirements. Current spec needs to change and is coming in Q4.",
    "[PRODUCT] NEW Technical Blueprint: All floors must now be 'Ventilated.' Use offsets to create gaps while maintaining height and the square roof.",
  ],
  table: [
    "[COMMERCIAL] Industry Standard: The market expects a classic 3-brick height for all office furniture.",
    "[COMMERCIAL] Structural Brief: Use 4 bricks for the support legs and 4 bricks for the tabletop surface.",
    "[COMMERCIAL] Aesthetic Trend: Light colors are the only colors passing focus groups. Ensure the tabletop is 4x8 studs wide.",
    "[PRODUCT] Technical Draft: Yellow bricks only. Legs are 2 solid 2-brick stacks each. 4-brick tabletop as 4x8 studs layout.",
    "[PRODUCT] Technical Blueprint:",
    "[PRODUCT] Compliance Check: Color choice and stability verified. No regulatory changes expected for this asset."
  ],
  bridge: [
    "[COMMERCIAL] User Research: Commuters need 2-stud wide lanes to allow two-way traffic flow.",
    "[COMMERCIAL] Competitive Edge: Our 'Blue Aluminum' model must span a 6-stud wide gap.",
    "[COMMERCIAL] Architecture Brief: Design consists of two identical 3-brick stairs connected by a 2-brick horizontal connection.",
    "[PRODUCT] Technical Draft: Blue construction. 2 identical stair units. 1-stud row offset connections for stability. 6-stud clearance.",
    "[PRODUCT] Technical Blueprint:",
    "[PRODUCT] Compliance Check: Traffic clearance and load-bearing verified. No regulatory changes expected for this asset."
  ],
  fish: [
    "[COMMERCIAL] Urgent Demand: This is what we understood as the requirements. We were asked to deliver one of these options by the end of the quarter!",
    "[COMMERCIAL] Vibe Check: The Big Fish has one primary color and distinct markings on the body.",
    "[COMMERCIAL] Our SAT team had a workshop with some CTOs and we now have a technical concept.",
    "[PRODUCT] Technical Draft:",
    "[PRODUCT] We had no time to finalize the blueprint. Some additional details: It uses 10 yellow bricks and 4 bricks of any one other color. Depending on our roadmap we may have to sacrifice another project's resources.",
    "[PRODUCT] Compliance Check: Swim-test passed. Streamlined body verified. Kids love it. No regulatory changes expected for this asset."
  ]
};

// Helper to get intelligence logs based on mode
export const getIntelligenceLogs = (isDemoMode: boolean): Record<string, string[]> => {
  return isDemoMode ? DEMO_INTELLIGENCE_LOGS : INTELLIGENCE_LOGS;
};

// Mapping specific project stages to images
export const STAGE_IMAGES: Record<string, ImageAsset> = {
  'fish_c1': IMAGES.fish_sketch,
  'fish_c3': IMAGES.fish_binary,
  'fish_p1': IMAGES.fish_draft,
  'fish_p2': IMAGES.fish_draft,
  'fish_audit': IMAGES.fish_final,
  'tower_p2': IMAGES.tower_final_v1,
  'tower_p3': IMAGES.tower_final_v2,
  'tower_audit': IMAGES.tower_final_v2,
  'table_p2': IMAGES.table_final,
  'table_audit': IMAGES.table_final,
  'bridge_p2': IMAGES.bridge_final,
  'bridge_audit': IMAGES.bridge_final,
  'banana_p2': IMAGES.banana_final,
  'banana_audit': IMAGES.banana_final,
};
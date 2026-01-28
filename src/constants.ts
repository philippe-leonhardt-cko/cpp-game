import { DiscoveryStage, ProjectConfig, ImageAsset } from './types';
import { IMAGES } from './images';

// export const STAGES: DiscoveryStage[] = [
//   { id: 'c1', label: 'Commercial', type: 'comm', cost: 100, duration: 30, description: 'Commercial Research' },
//   { id: 'c2', label: 'Commercial', type: 'comm', cost: 50, duration: 60, description: 'Commercial Research' },
//   { id: 'c3', label: 'Commercial', type: 'comm', cost: 25, duration: 120, description: 'Commercial Research' },
//   { id: 'p1', label: 'Product Draft', type: 'prod', cost: 200, duration: 180, description: 'Product Draft & Prototype', imageKey: '_draft' },
//   { id: 'p2', label: 'Product Spec', type: 'prod', cost: 600, duration: 360, description: 'Final Product Specification', imageKey: '_final' },
//   { id: 'v1', label: 'Product Validation', type: 'prod', cost: 75, duration: 60, description: 'Market Validation' },
//   { id: 'p3', label: 'Product Spec (New)', type: 'prod', cost: 300, duration: 180, description: 'NEW Final Product Specification', imageKey: '_final_new' },
// ];

export const STAGES: DiscoveryStage[] = [
  { id: 'c1', label: 'Commercial', type: 'comm', cost: 100, duration: 3, description: 'Commercial Research' },
  { id: 'c2', label: 'Commercial', type: 'comm', cost: 50, duration: 6, description: 'Commercial Research' },
  { id: 'c3', label: 'Commercial', type: 'comm', cost: 25, duration: 12, description: 'Commercial Research' },
  { id: 'p1', label: 'Product Draft', type: 'prod', cost: 200, duration: 18, description: 'Product Draft & Prototype', imageKey: '_draft' },
  { id: 'p2', label: 'Product Spec', type: 'prod', cost: 600, duration: 36, description: 'Final Product Specification', imageKey: '_final' },
  { id: 'v1', label: 'Product Validation', type: 'prod', cost: 75, duration: 6, description: 'Market Validation' },
  { id: 'p3', label: 'Product Spec (New)', type: 'prod', cost: 300, duration: 18, description: 'NEW Final Product Specification', imageKey: '_final_new' },
];

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

export const getQuarterlyYield = (projectId: string, quarter: number): number => {
  const project = PROJECTS[projectId];
  if (!project) return 0;
  // quarter is 1-based, array is 0-based
  return project.yields[Math.min(Math.max(0, quarter - 1), 3)] || 0;
};

// Based on the prompt's provided Intel Logs
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
};
import { DiscoveryStage, ProjectConfig, ImageAsset } from './types';
import { IMAGES } from './images';

// Based on "BACKUP CKO 2026.csv"
export const STAGES: DiscoveryStage[] = [
  { id: 'c1', label: 'Commercial', type: 'comm', cost: 30, duration: 10, description: 'Commercial Signal' }, // 10 sec
  { id: 'c2', label: 'Commercial', type: 'comm', cost: 30, duration: 20, description: 'Commercial Signal' }, // 20 sec
  { id: 'c3', label: 'Commercial', type: 'comm', cost: 30, duration: 30, description: 'Commercial Signal' }, // 30 sec
  { id: 'p1', label: 'Product', type: 'prod', cost: 100, duration: 120, description: 'Product Draft & Prototype', imageKey: '_draft' }, // 2 min
  { id: 'p2', label: 'Product', type: 'prod', cost: 200, duration: 300, description: 'Final Product Specification', imageKey: '_final' }, // 5 min
  { id: 'v1', label: 'Validation', type: 'prod', cost: 50, duration: 60, description: 'Market Validation' }, // 1 min
  { id: 'p3', label: 'Product', type: 'prod', cost: 200, duration: 300, description: 'NEW Final Product Specification', imageKey: '_final_new' }, // 5 min
];

export const PROJECTS: Record<string, ProjectConfig> = {
  tower: {
    id: 'tower',
    name: 'The Tower',
    icon: '🏯',
    bricks: 16,
    yields: [1000, 1400, 1400, 800], // Updated from BREAKOUT data
    description: 'Commercial Discovery',
    color: 'border-blue-500/50',
  },
  table: {
    id: 'table',
    name: 'The Table',
    icon: '🍽️',
    bricks: 8,
    yields: [1400, 400, 400, 0], // Updated from BREAKOUT data
    description: 'Commercial Discovery',
    color: 'border-amber-500/50',
  },
  bridge: {
    id: 'bridge',
    name: 'The Bridge',
    icon: '🌉',
    bricks: 8,
    yields: [600, 1200, 1200, 600], // Updated from BREAKOUT data
    description: 'Commercial Discovery',
    color: 'border-emerald-500/50',
  },
  fish: {
    id: 'fish',
    name: 'The Big Fish',
    icon: '🐟',
    bricks: 14,
    yields: [0, 0, 0, 1600], // Kept as high yield Q4 opportunity
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
    "COMMERCIAL DISCOVERY: Merchants like red brick towers with square tops.",
    "COMMERCIAL DISCOVERY: Our ICP demands 8-level structures with 2 bricks per level.",
    "COMMERCIAL DISCOVERY: We learned that they are asking for innovative planted eco-floors. Starting with the ground one, it should be every other floor.",
    "PRODUCT DISCOVERY: Foundation must be green with alternating green and red levels. It will be an 8-level structure with 2 bricks per level. The top is square.",
    "PRODUCT DISCOVERY: We now have the specs.",
    "VALIDATION: The Q3 regulation change may affect our initial assumptions about this project. While keeping the square top the rest must become more ventilated. We are working on a corrected spec but will need until Q4 to have it.",
    "PRODUCT DISCOVERY: We now have revised NEW specs."
  ],
  table: [
    "COMMERCIAL DISCOVERY: The market standard are tables of 3-brick height.",
    "COMMERCIAL DISCOVERY: Demand exists for sturdy legs: 4 bricks for the legs, 4 bricks for the top.",
    "COMMERCIAL DISCOVERY: The current trend shows a preference for light colored furniture.",
    "PRODUCT DISCOVERY: 4 bricks are used for the legs and 4 bricks are used for the top. One leg is a stack of 2 bricks. The tabletop dimensions are 4x8 studs. Yellow matches the demand best.",
    "PRODUCT DISCOVERY: We now have the specs.",
    "VALIDATION: Surface area adequate. Sturdiness tested. Color choice passed the pilot. The Q3 regulation does not affect our previous assumptions."
  ],
  bridge: [
    "COMMERCIAL DISCOVERY: Customers need to be able to cross the bridge in both directions at the same time. The building code requires a 2-stud lane per customer.",
    "COMMERCIAL DISCOVERY: Our analysis showed that competitors' bridges are too heavy and expensive. We want to offer a lighter and cost-efficient blue aluminium construction.",
    "COMMERCIAL DISCOVERY: The voice of the customer research clearly outlines demand for a bridge that crosses over a 6-stud-wide gap.",
    "PRODUCT DISCOVERY: The blue bridge has 2 identical stairs. A stair uses 3 bricks. Every level snaps together via a 1-stud row offset. The final product spans over a 6-stud-wide gap.",
    "PRODUCT DISCOVERY: We now have the specs.",
    "VALIDATION: Span clearance verified. Traffic ready. Load bearing within specs. The Q3 regulation does not affect our previous assumptions."
  ],
  fish: [
    "COMMERCIAL DISCOVERY: This is what we understood as the requirements. We committed to delivering one of these options by the end of the quarter!",
    "COMMERCIAL DISCOVERY: It seems that the 'Big Fish' has one primary color and markings in any one other color.",
    "COMMERCIAL DISCOVERY: Our SAT team had a workshop with some CTOs and we now have a concept.",
    "PRODUCT DISCOVERY: We now have a draft.",
    "PRODUCT DISCOVERY: We now have a draft and some additional details. It uses 10 yellow bricks and 4 bricks of any one other color. Depending on our roadmap we may have to sacrifice another project's resources.",
    "VALIDATION: Swim test passed. Kid friendly. BIG. The Q3 regulation does not affect our previous assumptions."
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
// ============================================================
// BRACKET CONFIGURATION — edit matchId values to match the
// matchId field of your matches created in the dashboard.
// Numbering follows Challonge's sequential order:
//   UB QFs (1-4) → LB R1 (5-6) → UB SFs (7-8) → LB R2 (9-10)
//   → UB Final (11) → LB SF (12) → LB Final (13) → Grand Final (14)
// ============================================================

export type BracketMatchConfig = {
  matchId: string;
  defaultLabel1: string;
  defaultLabel2: string;
};

export type BracketRoundConfig = {
  roundName: string;
  matches: BracketMatchConfig[];
};

// Upper Bracket
// Seeding: 3-0 teams → seeds 1-2, 3-1 teams → seeds 3-5, 3-2 teams → seeds 6-8
export const UPPER_BRACKET: BracketRoundConfig[] = [
  {
    roundName: "Quarter Finals",
    matches: [
      { matchId: "AC-1", defaultLabel1: "Seed 1 (3-0)", defaultLabel2: "Seed 8 (3-2)" },
      { matchId: "AC-2", defaultLabel1: "Seed 4 (3-1)", defaultLabel2: "Seed 5 (3-1)" },
      { matchId: "AC-3", defaultLabel1: "Seed 2 (3-0)", defaultLabel2: "Seed 7 (3-2)" },
      { matchId: "AC-4", defaultLabel1: "Seed 3 (3-1)", defaultLabel2: "Seed 6 (3-2)" },
    ],
  },
  {
    roundName: "Semi Finals",
    matches: [
      { matchId: "AC-7",  defaultLabel1: "W AC-1", defaultLabel2: "W AC-2" },
      { matchId: "AC-8",  defaultLabel1: "W AC-3", defaultLabel2: "W AC-4" },
    ],
  },
  {
    roundName: "Finals",
    matches: [
      { matchId: "AC-11", defaultLabel1: "W AC-7", defaultLabel2: "W AC-8" },
    ],
  },
];

// Lower Bracket
export const LOWER_BRACKET: BracketRoundConfig[] = [
  {
    roundName: "Round 1",
    matches: [
      { matchId: "AC-5",  defaultLabel1: "L AC-1", defaultLabel2: "L AC-4" },
      { matchId: "AC-6",  defaultLabel1: "L AC-2", defaultLabel2: "L AC-3" },
    ],
  },
  {
    roundName: "Round 2",
    matches: [
      { matchId: "AC-9",  defaultLabel1: "W AC-5", defaultLabel2: "L AC-7" },
      { matchId: "AC-10", defaultLabel1: "W AC-6", defaultLabel2: "L AC-8" },
    ],
  },
  {
    roundName: "Semi Finals",
    matches: [
      { matchId: "AC-12", defaultLabel1: "W AC-9",  defaultLabel2: "W AC-10" },
    ],
  },
  {
    roundName: "Finals",
    matches: [
      { matchId: "AC-13", defaultLabel1: "W AC-12", defaultLabel2: "L AC-11" },
    ],
  },
];

// Grand Final
export const GRAND_FINAL: BracketMatchConfig = {
  matchId: "AC-14",
  defaultLabel1: "W UB Finals",
  defaultLabel2: "W LB Finals",
};

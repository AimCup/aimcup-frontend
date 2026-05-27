// ============================================================
// SWISS BRACKET CONFIGURATION
// Edit matchId values to match the matchId field of your
// matches created in the dashboard.
//
// Week schedule (edit week: numbers to change groupings):
//   Current → Week1=R1+R2 | Week2=R3 | Week3=R4+R5
//   Option  → Week1=R1+R2 | Week2=R3+R4 | Week3=R5
//
// Mappool groups:
//   R1+R2 → Pool A (same mappool)
//   R3-R5 → Pool B (different mappool)
// ============================================================

export type SwissMatchConfig = {
  matchId: string;
  defaultLabel1: string;
  defaultLabel2: string;
};

export type SwissPoolConfig = {
  record: string;
  winnerStatus?: "advance" | "eliminate";
  loserStatus?: "advance" | "eliminate";
  matches: SwissMatchConfig[];
};

export type SwissRoundConfig = {
  roundNumber: number;
  week: number;
  mappoolGroup: "A" | "B";
  pools: SwissPoolConfig[];
};

export const SWISS_ROUNDS: SwissRoundConfig[] = [
  // ── Round 1 ─────────────────────────────────────────────
  {
    roundNumber: 1,
    week: 1,
    mappoolGroup: "A",
    pools: [
      {
        record: "0-0",
        matches: [
          { matchId: "AC-SW1",  defaultLabel1: "Seed 1",  defaultLabel2: "Seed 16" },
          { matchId: "AC-SW2",  defaultLabel1: "Seed 2",  defaultLabel2: "Seed 15" },
          { matchId: "AC-SW3",  defaultLabel1: "Seed 3",  defaultLabel2: "Seed 14" },
          { matchId: "AC-SW4",  defaultLabel1: "Seed 4",  defaultLabel2: "Seed 13" },
          { matchId: "AC-SW5",  defaultLabel1: "Seed 5",  defaultLabel2: "Seed 12" },
          { matchId: "AC-SW6",  defaultLabel1: "Seed 6",  defaultLabel2: "Seed 11" },
          { matchId: "AC-SW7",  defaultLabel1: "Seed 7",  defaultLabel2: "Seed 10" },
          { matchId: "AC-SW8",  defaultLabel1: "Seed 8",  defaultLabel2: "Seed 9"  },
        ],
      },
    ],
  },

  // ── Round 2 ─────────────────────────────────────────────
  {
    roundNumber: 2,
    week: 1,
    mappoolGroup: "A",
    pools: [
      {
        record: "1-0",
        matches: [
          { matchId: "AC-SW9",  defaultLabel1: "W AC-SW1", defaultLabel2: "W AC-SW8" },
          { matchId: "AC-SW10", defaultLabel1: "W AC-SW2", defaultLabel2: "W AC-SW7" },
          { matchId: "AC-SW11", defaultLabel1: "W AC-SW3", defaultLabel2: "W AC-SW6" },
          { matchId: "AC-SW12", defaultLabel1: "W AC-SW4", defaultLabel2: "W AC-SW5" },
        ],
      },
      {
        record: "0-1",
        matches: [
          { matchId: "AC-SW13", defaultLabel1: "L AC-SW1", defaultLabel2: "L AC-SW8" },
          { matchId: "AC-SW14", defaultLabel1: "L AC-SW2", defaultLabel2: "L AC-SW7" },
          { matchId: "AC-SW15", defaultLabel1: "L AC-SW3", defaultLabel2: "L AC-SW6" },
          { matchId: "AC-SW16", defaultLabel1: "L AC-SW4", defaultLabel2: "L AC-SW5" },
        ],
      },
    ],
  },

  // ── Round 3 ─────────────────────────────────────────────
  {
    roundNumber: 3,
    week: 2,
    mappoolGroup: "B",
    pools: [
      {
        record: "2-0",
        winnerStatus: "advance",   // → 3-0 qualifies
        matches: [
          { matchId: "AC-SW17", defaultLabel1: "W AC-SW9",  defaultLabel2: "W AC-SW12" },
          { matchId: "AC-SW18", defaultLabel1: "W AC-SW10", defaultLabel2: "W AC-SW11" },
        ],
      },
      {
        record: "1-1",
        matches: [
          { matchId: "AC-SW19", defaultLabel1: "W AC-SW13", defaultLabel2: "L AC-SW9"  },
          { matchId: "AC-SW20", defaultLabel1: "W AC-SW14", defaultLabel2: "L AC-SW10" },
          { matchId: "AC-SW21", defaultLabel1: "W AC-SW15", defaultLabel2: "L AC-SW11" },
          { matchId: "AC-SW22", defaultLabel1: "W AC-SW16", defaultLabel2: "L AC-SW12" },
        ],
      },
      {
        record: "0-2",
        loserStatus: "eliminate",  // → 0-3 eliminated
        matches: [
          { matchId: "AC-SW23", defaultLabel1: "L AC-SW13", defaultLabel2: "L AC-SW16" },
          { matchId: "AC-SW24", defaultLabel1: "L AC-SW14", defaultLabel2: "L AC-SW15" },
        ],
      },
    ],
  },

  // ── Round 4 ─────────────────────────────────────────────
  {
    roundNumber: 4,
    week: 3,
    mappoolGroup: "B",
    pools: [
      {
        record: "2-1",
        winnerStatus: "advance",   // → 3-1 qualifies
        matches: [
          { matchId: "AC-SW25", defaultLabel1: "L AC-SW17", defaultLabel2: "W AC-SW22" },
          { matchId: "AC-SW26", defaultLabel1: "L AC-SW18", defaultLabel2: "W AC-SW21" },
          { matchId: "AC-SW27", defaultLabel1: "W AC-SW19", defaultLabel2: "W AC-SW20" },
        ],
      },
      {
        record: "1-2",
        loserStatus: "eliminate",  // → 1-3 eliminated
        matches: [
          { matchId: "AC-SW28", defaultLabel1: "W AC-SW23", defaultLabel2: "L AC-SW22" },
          { matchId: "AC-SW29", defaultLabel1: "W AC-SW24", defaultLabel2: "L AC-SW21" },
          { matchId: "AC-SW30", defaultLabel1: "L AC-SW19", defaultLabel2: "L AC-SW20" },
        ],
      },
    ],
  },

  // ── Round 5 ─────────────────────────────────────────────
  {
    roundNumber: 5,
    week: 3,
    mappoolGroup: "B",
    pools: [
      {
        record: "2-2",
        winnerStatus: "advance",   // → 3-2 qualifies
        loserStatus: "eliminate",  // → 2-3 eliminated
        matches: [
          { matchId: "AC-SW31", defaultLabel1: "L AC-SW25", defaultLabel2: "W AC-SW28" },
          { matchId: "AC-SW32", defaultLabel1: "L AC-SW26", defaultLabel2: "W AC-SW29" },
          { matchId: "AC-SW33", defaultLabel1: "L AC-SW27", defaultLabel2: "W AC-SW30" },
        ],
      },
    ],
  },
];

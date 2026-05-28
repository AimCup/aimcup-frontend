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

// ============================================================
// DYNAMIC CONFIG GENERATOR
// Generates a Swiss bracket config for any team count.
// Pairing rules (matching the 16-team hardcoded config above):
//   - Single-source pool: first vs last within the group
//   - Two equal-size groups: same-position pairing (groupA[i] vs groupB[i])
//   - Two unequal-size groups: smaller group first, then first vs last
//   - Odd-size pool: last (lowest-seeded) team gets a free win (bye)
// ============================================================

export function generateSwissConfig(numTeams: number, prefix = "AC-SW"): SwissRoundConfig[] {
  if (numTeams < 2) return [];
  let matchCounter = 1;
  const makeId = () => `${prefix}${matchCounter++}`;

  type PoolState = { winGroup: string[]; loseGroup: string[] };
  let state = new Map<string, PoolState>([
    ["0-0", { winGroup: Array.from({ length: numTeams }, (_, i) => `Seed ${i + 1}`), loseGroup: [] }],
  ]);

  const ROUND_META = [
    { roundNumber: 1, week: 1, mappoolGroup: "A" as const, records: ["0-0"] },
    { roundNumber: 2, week: 1, mappoolGroup: "A" as const, records: ["1-0", "0-1"] },
    { roundNumber: 3, week: 2, mappoolGroup: "B" as const, records: ["2-0", "1-1", "0-2"] },
    { roundNumber: 4, week: 3, mappoolGroup: "B" as const, records: ["2-1", "1-2"] },
    { roundNumber: 5, week: 3, mappoolGroup: "B" as const, records: ["2-2"] },
  ];

  const rounds: SwissRoundConfig[] = [];

  for (const meta of ROUND_META) {
    const roundPools: SwissPoolConfig[] = [];
    const nextState = new Map<string, PoolState>();
    const ensure = (r: string) => {
      if (!nextState.has(r)) nextState.set(r, { winGroup: [], loseGroup: [] });
      return nextState.get(r)!;
    };

    for (const record of meta.records) {
      const ps = state.get(record);
      if (!ps || (ps.winGroup.length === 0 && ps.loseGroup.length === 0)) continue;

      const [w, l] = record.split("-").map(Number);
      const winRecord = `${w + 1}-${l}`;
      const loseRecord = `${w}-${l + 1}`;
      const { winGroup, loseGroup } = ps;
      const matches: SwissMatchConfig[] = [];
      const mWinners: string[] = [];
      const mLosers: string[] = [];

      const makeBye = (team: string) => {
        const id = makeId();
        matches.push({ matchId: id, defaultLabel1: team, defaultLabel2: "BYE" });
        mWinners.push(`W ${id}`);
      };

      const pairSingleGroup = (slots: string[]) => {
        const active = [...slots];
        if (active.length % 2 !== 0) makeBye(active.pop()!);
        const n = active.length;
        for (let i = 0; i < n / 2; i++) {
          const id = makeId();
          matches.push({ matchId: id, defaultLabel1: active[i], defaultLabel2: active[n - 1 - i] });
          mWinners.push(`W ${id}`);
          mLosers.push(`L ${id}`);
        }
      };

      if (loseGroup.length === 0) {
        pairSingleGroup(winGroup);
      } else if (winGroup.length === 0) {
        pairSingleGroup(loseGroup);
      } else if (winGroup.length === loseGroup.length) {
        // Equal size → same-position pairing
        for (let i = 0; i < winGroup.length; i++) {
          const id = makeId();
          matches.push({ matchId: id, defaultLabel1: winGroup[i], defaultLabel2: loseGroup[i] });
          mWinners.push(`W ${id}`);
          mLosers.push(`L ${id}`);
        }
      } else {
        // Unequal → smaller group first, pair first vs last
        const combined = winGroup.length < loseGroup.length
          ? [...winGroup, ...loseGroup]
          : [...loseGroup, ...winGroup];
        if (combined.length % 2 !== 0) makeBye(combined.pop()!);
        const n = combined.length;
        for (let i = 0; i < n / 2; i++) {
          const id = makeId();
          matches.push({ matchId: id, defaultLabel1: combined[i], defaultLabel2: combined[n - 1 - i] });
          mWinners.push(`W ${id}`);
          mLosers.push(`L ${id}`);
        }
      }

      ensure(winRecord).winGroup.push(...mWinners);
      ensure(loseRecord).loseGroup.push(...mLosers);

      const pool: SwissPoolConfig = { record, matches };
      if (w + 1 === 3) pool.winnerStatus = "advance";
      if (l + 1 === 3) pool.loserStatus = "eliminate";
      roundPools.push(pool);
    }

    state = nextState;
    if (roundPools.length > 0) {
      rounds.push({ roundNumber: meta.roundNumber, week: meta.week, mappoolGroup: meta.mappoolGroup, pools: roundPools });
    }
  }

  return rounds;
}

// Use hardcoded config for 16 teams (preserves existing slot IDs), generate for all other sizes.
export function getSwissConfig(numTeams: number): SwissRoundConfig[] {
  return numTeams === 16 ? SWISS_ROUNDS : generateSwissConfig(numTeams);
}

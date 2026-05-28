export type BracketMatchConfig = {
  matchId: string;
  defaultLabel1: string;
  defaultLabel2: string;
};

export type BracketRoundConfig = {
  roundName: string;
  matches: BracketMatchConfig[];
};

export type DEBracketConfig = {
  upperBracket: BracketRoundConfig[];
  lowerBracket: BracketRoundConfig[];
  grandFinal: BracketMatchConfig;
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

// ─── Dynamic DE generation ────────────────────────────────────────────────────

function ubRoundNames(k: number): string[] {
  return Array.from({ length: k }, (_, i) => {
    const fromEnd = k - 1 - i;
    if (fromEnd === 0) return "Finals";
    if (fromEnd === 1) return "Semi Finals";
    if (fromEnd === 2) return "Quarter Finals";
    return `Round of ${Math.pow(2, fromEnd + 1)}`;
  });
}

function lbRoundNames(k: number): string[] {
  const total = 2 * (k - 1);
  return Array.from({ length: total }, (_, j) => {
    const fromEnd = total - 1 - j;
    if (fromEnd === 0) return "Finals";
    if (fromEnd === 1) return "Semi Finals";
    return `Round ${j + 1}`;
  });
}

export function generateDEConfig(numTeams: number): DEBracketConfig {
  const n = numTeams;
  const k = Math.log2(n);

  // Number of matches per UB round: n/2, n/4, ..., 1
  const ubSizes = Array.from({ length: k }, (_, i) => n / Math.pow(2, i + 1));
  // Number of matches per LB round: pairs (n/4,n/4), (n/8,n/8), ..., (1,1)
  const lbCount = 2 * (k - 1);
  const lbSizes = Array.from({ length: lbCount }, (_, j) =>
    n / Math.pow(2, Math.floor(j / 2) + 2),
  );

  // Assign Challonge-style sequential match IDs.
  // Interleaved order per UB round i:
  //   i=0: UB[0], LB[0]
  //   i=1: UB[1], LB[1]
  //   i>=2: UB[i], LB[2i-2], LB[2i-1]
  let counter = 1;
  const ubIds: number[][] = ubSizes.map(() => []);
  const lbIds: number[][] = lbSizes.map(() => []);

  for (let i = 0; i < k; i++) {
    for (let m = 0; m < ubSizes[i]; m++) ubIds[i].push(counter++);
    if (i === 0) {
      for (let m = 0; m < lbSizes[0]; m++) lbIds[0].push(counter++);
    } else if (i === 1) {
      for (let m = 0; m < lbSizes[1]; m++) lbIds[1].push(counter++);
    } else {
      for (let m = 0; m < lbSizes[2 * i - 2]; m++) lbIds[2 * i - 2].push(counter++);
      for (let m = 0; m < lbSizes[2 * i - 1]; m++) lbIds[2 * i - 1].push(counter++);
    }
  }
  const gfId = counter;

  const ubNames = ubRoundNames(k);
  const lbNames = lbRoundNames(k);

  const upperBracket: BracketRoundConfig[] = ubIds.map((ids, i) => ({
    roundName: ubNames[i],
    matches: ids.map((id, m) => ({
      matchId: `AC-${id}`,
      defaultLabel1: i === 0 ? `Seed ${m + 1}` : `W AC-${ubIds[i - 1][m * 2]}`,
      defaultLabel2: i === 0 ? `Seed ${n - m}` : `W AC-${ubIds[i - 1][m * 2 + 1]}`,
    })),
  }));

  const lowerBracket: BracketRoundConfig[] = lbIds.map((ids, j) => ({
    roundName: lbNames[j],
    matches: ids.map((id, m) => {
      let l1: string, l2: string;
      if (j === 0) {
        // consol: pair UBR1 losers symmetrically
        l1 = `L AC-${ubIds[0][m]}`;
        l2 = `L AC-${ubIds[0][ubSizes[0] - 1 - m]}`;
      } else if (j % 2 === 1) {
        // drop: prev LB winners + this UB round's losers
        const ubLoseRound = Math.floor(j / 2) + 1;
        l1 = `W AC-${lbIds[j - 1][m]}`;
        l2 = `L AC-${ubIds[ubLoseRound][m]}`;
      } else {
        // consol: pair consecutive prev LB winners
        l1 = `W AC-${lbIds[j - 1][m * 2]}`;
        l2 = `W AC-${lbIds[j - 1][m * 2 + 1]}`;
      }
      return { matchId: `AC-${id}`, defaultLabel1: l1, defaultLabel2: l2 };
    }),
  }));

  return {
    upperBracket,
    lowerBracket,
    grandFinal: { matchId: `AC-${gfId}`, defaultLabel1: "W UB Finals", defaultLabel2: "W LB Finals" },
  };
}

// ─── Play-In generation ───────────────────────────────────────────────────────

export type PlayInConfig = {
  rounds: BracketRoundConfig[];
  directSeeds: number;
  playInSpots: number;
};

function seRoundName(roundIndex: number, totalRounds: number): string {
  if (totalRounds === 1) return "Play-In";
  const fromEnd = totalRounds - 1 - roundIndex;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi Finals";
  if (fromEnd === 2) return "Quarter Finals";
  return `Round ${roundIndex + 1}`;
}

export function getPlayInConfig(directSeeds: number, playInTeams: number, bracketSize: number): PlayInConfig | null {
  const playInSpots = bracketSize - directSeeds;
  if (playInSpots <= 0 || playInTeams <= 0 || playInTeams <= playInSpots) return null;

  // Pad to nearest power of 2 >= playInTeams
  const P = Math.pow(2, Math.ceil(Math.log2(Math.max(playInTeams, 2))));
  // Round playInSpots down to nearest power of 2 for clean bracket stop
  const spotsP2 = Math.pow(2, Math.floor(Math.log2(Math.max(playInSpots, 1))));
  const totalRounds = Math.round(Math.log2(P) - Math.log2(spotsP2));
  if (totalRounds <= 0) return null;

  let counter = 1;
  const roundIds: number[][] = [];
  for (let r = 0; r < totalRounds; r++) {
    const matchCount = P / Math.pow(2, r + 1);
    const ids: number[] = [];
    for (let m = 0; m < matchCount; m++) ids.push(counter++);
    roundIds.push(ids);
  }

  const rounds: BracketRoundConfig[] = roundIds.map((ids, r) => ({
    roundName: seRoundName(r, totalRounds),
    matches: ids.map((id, m) => {
      if (r === 0) {
        const piSeed1 = m + 1;
        const piSeed2 = P - m;
        return {
          matchId: `AC-PI-${id}`,
          defaultLabel1: piSeed1 <= playInTeams ? `Seed ${directSeeds + piSeed1}` : "BYE",
          defaultLabel2: piSeed2 <= playInTeams ? `Seed ${directSeeds + piSeed2}` : "BYE",
        };
      }
      const prev = roundIds[r - 1];
      return {
        matchId: `AC-PI-${id}`,
        defaultLabel1: `W AC-PI-${prev[m * 2]}`,
        defaultLabel2: `W AC-PI-${prev[m * 2 + 1]}`,
      };
    }),
  }));

  return { rounds, directSeeds, playInSpots: spotsP2 };
}

export function getDEConfig(numTeams: number): DEBracketConfig {
  if (numTeams <= 8) {
    return { upperBracket: UPPER_BRACKET, lowerBracket: LOWER_BRACKET, grandFinal: GRAND_FINAL };
  }
  // Round DOWN to nearest power of 2 — e.g. 20 teams → 16-team DE bracket
  const k = Math.floor(Math.log2(numTeams));
  return generateDEConfig(Math.pow(2, k));
}

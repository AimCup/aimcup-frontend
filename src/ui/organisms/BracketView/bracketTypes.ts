export type BracketEntryDto = {
  slotId: string;
  team1Name: string | null;
  team2Name: string | null;
  score1: number | null;
  score2: number | null;
  isFinished: boolean;
};

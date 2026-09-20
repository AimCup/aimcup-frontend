import React from "react";
import type { BracketEntryDto } from "./bracketTypes";
import BracketMatch from "./BracketMatch";
import {
  UPPER_BRACKET,
  LOWER_BRACKET,
  GRAND_FINAL,
  type BracketRoundConfig,
  type DEBracketConfig,
} from "./bracketConfig";

type BracketViewProps = {
  entries: BracketEntryDto[];
  onEdit?: (slotId: string) => void;
  deConfig?: DEBracketConfig;
};
const MATCH_SLOT_H = 88;

function RoundColumn({
  round,
  entryMap,
  totalSlots,
  onEdit,
}: {
  round: BracketRoundConfig;
  entryMap: Map<string, BracketEntryDto>;
  totalSlots: number;
  onEdit?: (slotId: string) => void;
}) {
  return (
    <div className="flex flex-col" style={{ minHeight: totalSlots * MATCH_SLOT_H }}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4 whitespace-nowrap">
        {round.roundName}
      </p>
      <div className="flex flex-col flex-1 justify-around">
        {round.matches.map((slot) => (
          <BracketMatch
            key={slot.matchId}
            config={slot}
            entry={entryMap.get(slot.matchId) ?? null}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

const BracketView = ({ entries, onEdit, deConfig }: BracketViewProps) => {
  const entryMap = new Map<string, BracketEntryDto>(entries.map((e) => [e.slotId, e]));

  const ub = deConfig?.upperBracket ?? UPPER_BRACKET;
  const lb = deConfig?.lowerBracket ?? LOWER_BRACKET;
  const gf = deConfig?.grandFinal ?? GRAND_FINAL;
  const reset = deConfig?.bracketReset;
  const ubSlotCount = ub[0]?.matches.length ?? 4;
  const lbSlotCount = lb[0]?.matches.length ?? 2;

  // The reset is only played when the lower bracket team (slot 2 of the grand final) wins it.
  const gfEntry = entryMap.get(gf.matchId) ?? null;
  const gfScore1 = gfEntry?.score1 ?? null;
  const gfScore2 = gfEntry?.score2 ?? null;
  const resetSkipped = gfScore1 !== null && gfScore2 !== null && gfScore1 > gfScore2;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-5 rounded-sm bg-deepRed inline-block" />
          Upper Bracket
        </h2>
        <div className="flex gap-8 items-stretch">
          {ub.map((round) => (
            <RoundColumn key={round.roundName} round={round} entryMap={entryMap} totalSlots={ubSlotCount} onEdit={onEdit} />
          ))}
        </div>
      </div>

      <div className="my-10 border-t border-gray-700/50" />

      <div className="flex gap-8 items-start">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-5 rounded-sm bg-flatRed inline-block" />
            Lower Bracket
          </h2>
          <div className="flex gap-8 items-stretch">
            {lb.map((round) => (
              <RoundColumn key={round.roundName} round={round} entryMap={entryMap} totalSlots={lbSlotCount} onEdit={onEdit} />
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 self-center flex gap-8 items-end">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
              Grand Final
            </p>
            <BracketMatch config={gf} entry={gfEntry} onEdit={onEdit} />
          </div>

          {reset && (
            <div className={resetSkipped ? "opacity-40" : ""}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4 whitespace-nowrap">
                Bracket Reset
                <span className="block text-[10px] font-normal normal-case tracking-normal text-gray-500">
                  {resetSkipped ? "not played" : "if necessary"}
                </span>
              </p>
              <BracketMatch config={reset} entry={entryMap.get(reset.matchId) ?? null} onEdit={onEdit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BracketView;

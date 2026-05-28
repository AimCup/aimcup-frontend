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
  const ubSlotCount = ub[0]?.matches.length ?? 4;
  const lbSlotCount = lb[0]?.matches.length ?? 2;

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

        <div className="flex-shrink-0 self-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
            Grand Final
          </p>
          <BracketMatch config={gf} entry={entryMap.get(gf.matchId) ?? null} onEdit={onEdit} />
        </div>
      </div>
    </div>
  );
};

export default BracketView;

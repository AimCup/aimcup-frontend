import React from "react";
import type { BracketEntryDto } from "./bracketTypes";
import BracketMatch from "./BracketMatch";
import type { PlayInConfig } from "./bracketConfig";

type PlayInViewProps = {
  config: PlayInConfig;
  entries: BracketEntryDto[];
  bracketSize: number;
  onEdit?: (slotId: string) => void;
};

const MATCH_SLOT_H = 88;

const PlayInView = ({ config, entries, bracketSize, onEdit }: PlayInViewProps) => {
  const entryMap = new Map<string, BracketEntryDto>(entries.map((e) => [e.slotId, e]));
  const totalSlots = config.rounds[0]?.matches.length ?? 1;

  return (
    <div className="w-full overflow-x-auto pb-4">
      {config.directSeeds > 0 && (
        <p className="mb-6 text-sm text-gray-500">
          Seeds 1–{config.directSeeds} advance directly to the {bracketSize}-team bracket.
        </p>
      )}

      <div className="flex gap-8 items-stretch">
        {config.rounds.map((round) => (
          <div key={round.roundName} className="flex flex-col" style={{ minHeight: totalSlots * MATCH_SLOT_H }}>
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
        ))}

        {/* Winners advance to DE */}
        <div className="flex flex-col justify-around" style={{ paddingTop: "2.1rem", minHeight: totalSlots * MATCH_SLOT_H }}>
          {Array.from({ length: config.playInSpots }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-8 border-t border-gray-600" />
              <span className="text-[11px] text-gray-500 whitespace-nowrap px-2">
                → {bracketSize}-team DE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayInView;

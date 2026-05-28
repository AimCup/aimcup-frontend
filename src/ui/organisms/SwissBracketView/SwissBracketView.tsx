import React from "react";
import type { BracketEntryDto } from "../BracketView/bracketTypes";
import BracketMatch from "../BracketView/BracketMatch";
import { SWISS_ROUNDS, type SwissPoolConfig, type SwissRoundConfig } from "./swissBracketConfig";

type SwissBracketViewProps = {
  entries: BracketEntryDto[];
  rounds?: SwissRoundConfig[];
  onEdit?: (slotId: string) => void;
};

function PoolStatusBadges({ pool }: { pool: SwissPoolConfig }) {
  return (
    <div className="flex flex-col gap-0.5 mt-1">
      {pool.winnerStatus === "advance" && (
        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-mintGreen/20 text-mintGreen">
          W → Qualifies
        </span>
      )}
      {pool.loserStatus === "eliminate" && (
        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-deepRed/30 text-flatRed">
          L → Eliminated
        </span>
      )}
    </div>
  );
}

function PoolSection({
  pool,
  entryMap,
  onEdit,
}: {
  pool: SwissPoolConfig;
  entryMap: Map<string, BracketEntryDto>;
  onEdit?: (slotId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="inline-block rounded border border-gray-600 px-2 py-0.5 font-mono text-xs font-bold text-gray-300">
          {pool.record}
        </span>
        <PoolStatusBadges pool={pool} />
      </div>
      {pool.matches.map((slot) => (
        <BracketMatch
          key={slot.matchId}
          config={slot}
          entry={entryMap.get(slot.matchId) ?? null}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function RoundColumn({
  round,
  entryMap,
  weekChanged,
  onEdit,
}: {
  round: SwissRoundConfig;
  entryMap: Map<string, BracketEntryDto>;
  weekChanged: boolean;
  onEdit?: (slotId: string) => void;
}) {
  return (
    <>
      {weekChanged && (
        <div className="flex flex-col items-center self-stretch">
          <div className="flex-1 border-l border-dashed border-gray-600 mx-2" />
        </div>
      )}
      <div className="flex flex-col gap-5 flex-shrink-0 w-56">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
              Round {round.roundNumber}
            </p>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-gray-700 text-gray-400">
              Pool {round.mappoolGroup}
            </span>
          </div>
          <span className="text-[10px] text-gray-600">Week {round.week}</span>
        </div>
        <div className="flex flex-col gap-6">
          {round.pools.map((pool) => (
            <PoolSection key={pool.record} pool={pool} entryMap={entryMap} onEdit={onEdit} />
          ))}
        </div>
      </div>
    </>
  );
}

const SwissBracketView = ({ entries, rounds: roundsProp, onEdit }: SwissBracketViewProps) => {
  const entryMap = new Map<string, BracketEntryDto>(entries.map((e) => [e.slotId, e]));
  const rounds = roundsProp ?? SWISS_ROUNDS;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-8 items-start min-w-max">
        {rounds.map((round, i) => {
          const prev = rounds[i - 1];
          const weekChanged = i > 0 && prev.week !== round.week;
          return (
            <RoundColumn
              key={round.roundNumber}
              round={round}
              entryMap={entryMap}
              weekChanged={weekChanged}
              onEdit={onEdit}
            />
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 border-t border-gray-700/50 pt-5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-mintGreen/50 inline-block" />
          Winner qualifies (3 wins)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-deepRed/50 inline-block" />
          Loser eliminated (3 losses)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-600 inline-block" />
          Pool A / B = mappool used for that round
        </span>
        <span className="ml-auto text-gray-600">- - - week boundary</span>
      </div>
    </div>
  );
};

export default SwissBracketView;

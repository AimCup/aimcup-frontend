import React from "react";
import type { BracketEntryDto } from "./bracketTypes";
import type { BracketMatchConfig } from "./bracketConfig";

type BracketMatchProps = {
  config: BracketMatchConfig;
  entry?: BracketEntryDto | null;
  onEdit?: (slotId: string) => void;
};

const BracketMatch = ({ config, entry, onEdit }: BracketMatchProps) => {
  const score1 = entry?.score1 ?? null;
  const score2 = entry?.score2 ?? null;
  const hasResult = score1 !== null && score2 !== null;
  const team1Won = score1 !== null && score2 !== null && score1 > score2;
  const team2Won = score1 !== null && score2 !== null && score2 > score1;

  const team1Name = entry?.team1Name ?? config.defaultLabel1;
  const team2Name = entry?.team2Name ?? config.defaultLabel2;

  const isBye = team2Name === "BYE";

  return (
    <div className="w-52 flex-shrink-0">
      <div className="text-[10px] text-gray-500 mb-1 font-mono tracking-wide px-0.5">
        {config.matchId}
      </div>
      <div
        className={`rounded border overflow-hidden shadow-lg ${
          isBye
            ? "border-gray-700/50 opacity-70"
            : `border-gray-700 ${onEdit ? "cursor-pointer hover:border-gray-500 transition-colors" : ""}`
        }`}
        onClick={!isBye && onEdit ? () => onEdit(config.matchId) : undefined}
      >
        {/* Team 1 */}
        <div
          className={`flex items-center justify-between px-3 py-2 border-b border-gray-700 transition-colors ${
            isBye
              ? "bg-mintGreen/5 border-b-mintGreen/20"
              : team1Won
                ? "bg-mintGreen/10 border-b-mintGreen/30"
                : team2Won
                  ? "opacity-40"
                  : "bg-tuned"
          }`}
        >
          <span className={`text-sm truncate ${isBye || team1Won ? "text-mintGreen font-semibold" : "text-white"}`}>
            {team1Name}
          </span>
          {hasResult && !isBye && (
            <span className={`text-sm font-bold tabular-nums ml-3 ${team1Won ? "text-mintGreen" : "text-gray-400"}`}>
              {score1}
            </span>
          )}
        </div>

        {/* Team 2 / BYE */}
        {isBye ? (
          <div className="flex items-center px-3 py-2 bg-tuned opacity-40">
            <span className="text-sm italic text-gray-500">BYE</span>
          </div>
        ) : (
          <div
            className={`flex items-center justify-between px-3 py-2 transition-colors ${
              team2Won ? "bg-mintGreen/10" : team1Won ? "opacity-40 bg-tuned" : "bg-tuned"
            }`}
          >
            <span className={`text-sm truncate ${team2Won ? "text-mintGreen font-semibold" : "text-white"}`}>
              {team2Name}
            </span>
            {hasResult && (
              <span className={`text-sm font-bold tabular-nums ml-3 ${team2Won ? "text-mintGreen" : "text-gray-400"}`}>
                {score2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BracketMatch;

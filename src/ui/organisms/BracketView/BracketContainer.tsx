"use client";

import React, { useState } from "react";
import SwissBracketView from "../SwissBracketView/SwissBracketView";
import { getSwissConfig } from "../SwissBracketView/swissBracketConfig";
import { getDEConfig, getPlayInConfig } from "./bracketConfig";
import BracketView from "./BracketView";
import PlayInView from "./PlayInView";
import type { BracketEntryDto } from "./bracketTypes";

type View = "swiss" | "playin" | "de";

type BracketContainerProps = {
  entries: BracketEntryDto[];
  hasSwiss: boolean;
  numTeams?: number;
  numSwissTeams?: number;
  directSeeds?: number;
  playInTeams?: number;
  onEdit?: (slotId: string) => void;
};

const BracketContainer = ({ entries, hasSwiss, numTeams, numSwissTeams, directSeeds, playInTeams, onEdit }: BracketContainerProps) => {
  const n = numTeams && numTeams > 0 ? numTeams : 16;
  const sn = numSwissTeams && numSwissTeams > 0 ? numSwissTeams : n;
  const swissRounds = getSwissConfig(sn);
  const deConfig = getDEConfig(n);
  const deFirstRound = deConfig.upperBracket[0]?.roundName ?? "Quarter Finals";
  const playInConfig = (directSeeds != null && playInTeams != null)
    ? getPlayInConfig(directSeeds, playInTeams, n)
    : null;

  const defaultView: View = hasSwiss ? "swiss" : playInConfig ? "playin" : "de";
  const [view, setView] = useState<View>(defaultView);

  const views = [
    ...(hasSwiss
      ? [{ id: "swiss" as View, label: "Swiss Stage", sub: `Rounds 1–5 · ${sn} teams` }]
      : []),
    ...(playInConfig
      ? [{ id: "playin" as View, label: "Play-In", sub: `${playInTeams} teams · ${playInConfig.playInSpots} DE spot${playInConfig.playInSpots > 1 ? "s" : ""}` }]
      : []),
    { id: "de" as View, label: "Double Elimination", sub: `${deFirstRound} → Grand Final · ${n} teams` },
  ];

  return (
    <div className="w-full">
      {views.length > 1 && (
        <div className="flex gap-2 mb-8">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex flex-col items-start rounded-lg border px-4 py-2.5 text-left transition-colors ${
                view === v.id
                  ? "border-deepRed bg-deepRed/10 text-white"
                  : "border-gray-700 bg-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-sm font-semibold">{v.label}</span>
              <span className="text-[11px] text-gray-500">{v.sub}</span>
            </button>
          ))}
        </div>
      )}

      {view === "swiss" && <SwissBracketView entries={entries} rounds={swissRounds} onEdit={onEdit} />}
      {view === "playin" && playInConfig && (
        <PlayInView config={playInConfig} entries={entries} bracketSize={n} onEdit={onEdit} />
      )}
      {view === "de" && <BracketView entries={entries} onEdit={onEdit} deConfig={deConfig} />}
    </div>
  );
};

export default BracketContainer;

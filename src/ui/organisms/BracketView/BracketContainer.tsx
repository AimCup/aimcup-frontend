"use client";

import React, { useState } from "react";
import type { BracketEntryDto } from "./bracketTypes";
import BracketView from "./BracketView";
import SwissBracketView from "../SwissBracketView/SwissBracketView";

type View = "swiss" | "de";

type BracketContainerProps = {
  entries: BracketEntryDto[];
  hasSwiss: boolean;
  onEdit?: (slotId: string) => void;
};

const BracketContainer = ({ entries, hasSwiss, onEdit }: BracketContainerProps) => {
  const [view, setView] = useState<View>(hasSwiss ? "swiss" : "de");

  const views = [
    ...(hasSwiss
      ? [{ id: "swiss" as View, label: "Swiss Stage", sub: "Rounds 1–5 · 16 teams" }]
      : []),
    { id: "de" as View, label: "Double Elimination", sub: "QF → Grand Final · 8 teams" },
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

      {view === "swiss" ? (
        <SwissBracketView entries={entries} onEdit={onEdit} />
      ) : (
        <BracketView entries={entries} onEdit={onEdit} />
      )}
    </div>
  );
};

export default BracketContainer;

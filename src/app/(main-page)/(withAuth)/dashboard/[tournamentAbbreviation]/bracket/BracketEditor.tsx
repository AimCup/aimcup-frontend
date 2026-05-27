"use client";

import React, { useRef, useState } from "react";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";
import BracketContainer from "@ui/organisms/BracketView/BracketContainer";
import { upsertBracketEntryAction } from "@/actions/admin/adminBracketEntryActions";
import { SWISS_ROUNDS } from "@ui/organisms/SwissBracketView/swissBracketConfig";

type BracketEditorProps = {
  tournamentAbb: string;
  initialEntries: BracketEntryDto[];
  hasSwiss: boolean;
};

// Build a map from "W AC-SWx" / "L AC-SWx" → {matchId, position: 1|2}
// so we know where winners/losers advance to.
const ADVANCEMENT_MAP = (() => {
  const map = new Map<string, { matchId: string; position: 1 | 2 }>();
  for (const round of SWISS_ROUNDS) {
    for (const pool of round.pools) {
      for (const match of pool.matches) {
        if (match.defaultLabel1) map.set(match.defaultLabel1, { matchId: match.matchId, position: 1 });
        if (match.defaultLabel2) map.set(match.defaultLabel2, { matchId: match.matchId, position: 2 });
      }
    }
  }
  return map;
})();

export const BracketEditor = ({ tournamentAbb, initialEntries, hasSwiss }: BracketEditorProps) => {
  const [entries, setEntries] = useState<BracketEntryDto[]>(initialEntries);
  const [selected, setSelected] = useState<BracketEntryDto | null>(null);
  const [form, setForm] = useState({ team1Name: "", team2Name: "", score1: "", score2: "", isFinished: false });
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const upsertEntry = (entry: BracketEntryDto) =>
    setEntries((prev) =>
      prev.some((e) => e.slotId === entry.slotId)
        ? prev.map((e) => (e.slotId === entry.slotId ? entry : e))
        : [...prev, entry],
    );

  const propagateResult = async (
    slotId: string,
    winnerName: string | null,
    loserName: string | null,
    currentEntries: BracketEntryDto[],
  ) => {
    const targets = [
      { label: `W ${slotId}`, teamName: winnerName },
      { label: `L ${slotId}`, teamName: loserName },
    ];

    for (const { label, teamName } of targets) {
      if (!teamName) continue;
      const target = ADVANCEMENT_MAP.get(label);
      if (!target) continue;

      const existing = currentEntries.find((e) => e.slotId === target.matchId);
      const update = {
        team1Name: target.position === 1 ? teamName : (existing?.team1Name ?? null),
        team2Name: target.position === 2 ? teamName : (existing?.team2Name ?? null),
        score1: existing?.score1 ?? null,
        score2: existing?.score2 ?? null,
        isFinished: existing?.isFinished ?? false,
      };
      const r = await upsertBracketEntryAction(tournamentAbb, target.matchId, update);
      if (r.status) upsertEntry(r.entry);
    }
  };

  const openEdit = (slotId: string) => {
    const existing = entries.find((e) => e.slotId === slotId);
    const entry: BracketEntryDto = existing ?? {
      slotId,
      team1Name: null,
      team2Name: null,
      score1: null,
      score2: null,
      isFinished: false,
    };
    setSelected(entry);
    setForm({
      team1Name: entry.team1Name ?? "",
      team2Name: entry.team2Name ?? "",
      score1: entry.score1 !== null ? String(entry.score1) : "",
      score2: entry.score2 !== null ? String(entry.score2) : "",
      isFinished: entry.isFinished,
    });
    dialogRef.current?.showModal();
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);

    const score1 = form.score1 !== "" ? Number(form.score1) : null;
    const score2 = form.score2 !== "" ? Number(form.score2) : null;
    const team1Name = form.team1Name || null;
    const team2Name = form.team2Name || null;

    const data = { team1Name, team2Name, score1, score2, isFinished: form.isFinished };
    const result = await upsertBracketEntryAction(tournamentAbb, selected.slotId, data);

    if (result.status) {
      upsertEntry(result.entry);

      if (form.isFinished && score1 !== null && score2 !== null && score1 !== score2) {
        const winnerName = score1 > score2 ? team1Name : team2Name;
        const loserName = score1 > score2 ? team2Name : team1Name;
        await propagateResult(selected.slotId, winnerName, loserName, [
          ...entries.filter((e) => e.slotId !== selected.slotId),
          result.entry,
        ]);
      }
    }

    setSaving(false);
    dialogRef.current?.close();
  };

  return (
    <>
      <BracketContainer entries={entries} hasSwiss={hasSwiss} onEdit={openEdit} />

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-sm">
          {selected && (
            <>
              <h3 className="font-bold text-lg mb-4 font-mono">{selected.slotId}</h3>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <input
                    className="input input-bordered input-sm flex-1"
                    placeholder="Team 1"
                    value={form.team1Name}
                    onChange={(e) => setForm((f) => ({ ...f, team1Name: e.target.value }))}
                  />
                  <input
                    className="input input-bordered input-sm w-16 text-center"
                    type="number"
                    min={0}
                    placeholder="—"
                    value={form.score1}
                    onChange={(e) => setForm((f) => ({ ...f, score1: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    className="input input-bordered input-sm flex-1"
                    placeholder="Team 2"
                    value={form.team2Name}
                    onChange={(e) => setForm((f) => ({ ...f, team2Name: e.target.value }))}
                  />
                  <input
                    className="input input-bordered input-sm w-16 text-center"
                    type="number"
                    min={0}
                    placeholder="—"
                    value={form.score2}
                    onChange={(e) => setForm((f) => ({ ...f, score2: e.target.value }))}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={form.isFinished}
                    onChange={(e) => setForm((f) => ({ ...f, isFinished: e.target.checked }))}
                  />
                  Mark as finished
                </label>
              </div>

              <div className="modal-action mt-6">
                <form method="dialog">
                  <button className="btn btn-ghost btn-sm mr-2">Cancel</button>
                </form>
                <button className="btn btn-sm btn-primary" disabled={saving} onClick={save}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

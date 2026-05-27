import React from "react";
import { cookies } from "next/headers";
import { client, getStages, getTeamsByTournament } from "../../../../../../../client";
import { BracketEditor } from "./BracketEditor";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";
import { SWISS_ROUNDS } from "@ui/organisms/SwissBracketView/swissBracketConfig";
import { upsertBracketEntryAction } from "@/actions/admin/adminBracketEntryActions";

// R1 seeding: index i → seed (i+1) vs seed (16-i), matches AC-SW1..AC-SW8
const R1_SLOTS = SWISS_ROUNDS[0].pools[0].matches.map((m, i) => ({
  matchId: m.matchId,
  seed1: i + 1,
  seed2: 16 - i,
}));

const BracketEditorPage = async ({
  params: { tournamentAbbreviation },
}: {
  params: { tournamentAbbreviation: string };
}) => {
  const cookie = cookies().get("JWT")?.value;
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: { Cookie: `token=${cookie}` },
  });

  const [entriesRes, stagesRes, teamsRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentAbbreviation}/bracket-entries`,
      { headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
    ),
    getStages({ path: { abbreviation: tournamentAbbreviation } }),
    getTeamsByTournament({ path: { abbreviation: tournamentAbbreviation } }),
  ]);

  let entries: BracketEntryDto[] = entriesRes.ok ? await entriesRes.json() : [];
  const hasSwiss = (stagesRes.data ?? []).some((s) => s.stageType?.startsWith("SWISS"));
  const teams = teamsRes.data ?? [];

  // Build seed → team name map (seed field added in V1_40 era)
  const seedMap = new Map<number, string>();
  for (const team of teams) {
    if ((team as any).seed != null) {
      seedMap.set((team as any).seed as number, team.name);
    }
  }

  // Auto-create R1 entries from seeds if not yet saved
  if (seedMap.size > 0 && hasSwiss) {
    const existingSlotIds = new Set(entries.map((e) => e.slotId));
    const toInit = R1_SLOTS.filter((s) => !existingSlotIds.has(s.matchId));

    if (toInit.length > 0) {
      const created = await Promise.all(
        toInit.map((s) =>
          upsertBracketEntryAction(tournamentAbbreviation, s.matchId, {
            team1Name: seedMap.get(s.seed1) ?? null,
            team2Name: seedMap.get(s.seed2) ?? null,
            score1: null,
            score2: null,
            isFinished: false,
          }),
        ),
      );
      for (const r of created) {
        if (r.status) entries = [...entries, r.entry];
      }
    }
  }

  return (
    <div className="flex w-full flex-col !px-3 !py-2">
      <h2 className="mb-2 text-3xl font-bold leading-relaxed">Bracket editor</h2>
      <p className="mb-6 text-sm text-gray-500">Click any match to set teams and results.</p>
      <BracketEditor
        tournamentAbb={tournamentAbbreviation}
        initialEntries={entries}
        hasSwiss={hasSwiss}
      />
    </div>
  );
};

export default BracketEditorPage;

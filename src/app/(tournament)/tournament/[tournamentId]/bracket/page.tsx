import React from "react";
import { cookies } from "next/headers";
import { client, getStages, getTeamsByTournament } from "../../../../../../client";
import Section from "@ui/atoms/Section/Section";
import BracketContainer from "@ui/organisms/BracketView/BracketContainer";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";

const BracketPage = async ({ params }: { params: { tournamentId: string } }) => {
  const cookie = cookies().get("JWT")?.value;
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: { Cookie: `token=${cookie}` },
  });

  const [entriesRes, tournamentRes, stagesRes, teamsRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.tournamentId}/bracket-entries`,
      { headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.tournamentId}`,
      { headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
    ),
    getStages({ path: { abbreviation: params.tournamentId } }),
    getTeamsByTournament({ path: { abbreviation: params.tournamentId } }),
  ]);

  const entries: BracketEntryDto[] = entriesRes.ok ? await entriesRes.json() : [];
  const tournamentData = tournamentRes.ok ? await tournamentRes.json() : null;
  const stages = stagesRes.data ?? [];
  const teams = teamsRes.data ?? [];

  const hasSwiss = stages.some((s) => s.stageType?.startsWith("SWISS"));
  const numSwissTeams = (tournamentData as any)?.swissTeams ?? (teams.length > 0 ? teams.length : 16);
  const numTeams = tournamentData?.bracketSize ?? (teams.length > 0 ? teams.length : 16);
  const directSeeds = (tournamentData as any)?.numQualifiers ?? undefined;
  const playInTeams = (tournamentData as any)?.playInTeams ?? undefined;

  return (
    <Section id="bracket" className="flex-col">
      <div className="flex w-full flex-col !px-3 !py-2">
        <h2 className="mb-8 text-3xl font-bold leading-relaxed">Bracket</h2>
        <BracketContainer entries={entries} hasSwiss={hasSwiss} numTeams={numTeams} numSwissTeams={numSwissTeams} directSeeds={directSeeds} playInTeams={playInTeams} />
      </div>
    </Section>
  );
};

export default BracketPage;

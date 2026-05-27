import React from "react";
import { cookies } from "next/headers";
import { client, getStages } from "../../../../../../client";
import Section from "@ui/atoms/Section/Section";
import BracketContainer from "@ui/organisms/BracketView/BracketContainer";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";

const BracketPage = async ({ params }: { params: { tournamentId: string } }) => {
  const cookie = cookies().get("JWT")?.value;
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: { Cookie: `token=${cookie}` },
  });

  const [entriesRes, stagesRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.tournamentId}/bracket-entries`,
      { headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
    ),
    getStages({ path: { abbreviation: params.tournamentId } }),
  ]);

  const entries: BracketEntryDto[] = entriesRes.ok ? await entriesRes.json() : [];
  const stages = stagesRes.data ?? [];

  const hasSwiss = stages.some((s) =>
    s.stageType?.startsWith("SWISS"),
  );

  return (
    <Section id="bracket" className="flex-col">
      <div className="flex w-full flex-col !px-3 !py-2">
        <h2 className="mb-8 text-3xl font-bold leading-relaxed">Bracket</h2>
        <BracketContainer entries={entries} hasSwiss={hasSwiss} />
      </div>
    </Section>
  );
};

export default BracketPage;

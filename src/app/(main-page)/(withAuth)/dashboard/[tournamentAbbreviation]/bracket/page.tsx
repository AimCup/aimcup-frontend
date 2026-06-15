import React from "react";
import { cookies } from "next/headers";
import { client, getStages, getTeamsByTournament } from "../../../../../../../client";
import { BracketEditor } from "./BracketEditor";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";
import { getSwissConfig } from "@ui/organisms/SwissBracketView/swissBracketConfig";
import { upsertBracketEntryAction } from "@/actions/admin/adminBracketEntryActions";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

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

	const [entriesRes, tournamentRes, stagesRes, teamsRes] = await Promise.all([
		fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentAbbreviation}/bracket-entries`,
			{ headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
		),
		fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentAbbreviation}`,
			{ headers: { Cookie: `token=${cookie}` }, cache: "no-store" },
		),
		getStages({ path: { abbreviation: tournamentAbbreviation } }),
		getTeamsByTournament({ path: { abbreviation: tournamentAbbreviation } }),
	]);

	let entries: BracketEntryDto[] = entriesRes.ok ? await entriesRes.json() : [];
	const tournamentData = tournamentRes.ok ? await tournamentRes.json() : null;
	const hasSwiss = (stagesRes.data ?? []).some((s) => s.stageType?.startsWith("SWISS"));
	const teams = teamsRes.data ?? [];
	const numSwissTeams: number = tournamentData?.swissTeams ?? (teams.length > 0 ? teams.length : 16);
	const numTeams: number = tournamentData?.bracketSize ?? (teams.length > 0 ? teams.length : 16);
	const directSeeds: number | undefined = tournamentData?.numQualifiers ?? undefined;
	const playInTeams: number | undefined = tournamentData?.playInTeams ?? undefined;

	const swissRounds = getSwissConfig(numTeams);
	const R1_SLOTS = swissRounds[0].pools[0].matches.map((m, i) => ({
		matchId: m.matchId,
		seed1: i + 1,
		seed2: numTeams - i,
	}));

	// Build seed → team name map
	const seedMap = new Map<number, string>();
	for (const team of teams) {
		const teamSeed = (team as { seed?: number }).seed;
		if (teamSeed != null) {
			seedMap.set(teamSeed, team.name);
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
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Bracket editor"
				subtitle="Click any match to set teams and results."
			/>

			<Card className="p-0 overflow-x-auto">
				<BracketEditor
					tournamentAbb={tournamentAbbreviation}
					initialEntries={entries}
					hasSwiss={hasSwiss}
					numTeams={numTeams}
					numSwissTeams={numSwissTeams}
					directSeeds={directSeeds}
					playInTeams={playInTeams}
				/>
			</Card>
		</div>
	);
};

export default BracketEditorPage;

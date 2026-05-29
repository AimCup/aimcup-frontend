"use server";

import { cookies } from "next/headers";
import type { BracketEntryDto } from "@ui/organisms/BracketView/bracketTypes";

export async function upsertBracketEntryAction(
	tournamentAbbreviation: string,
	slotId: string,
	data: {
		team1Name: string | null;
		team2Name: string | null;
		score1: number | null;
		score2: number | null;
		isFinished: boolean;
	},
): Promise<{ status: true; entry: BracketEntryDto } | { status: false; errorMessage: string }> {
	const cookie = cookies().get("JWT")?.value;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/admin/tournaments/${tournamentAbbreviation}/bracket-entries/${slotId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Cookie: `token=${cookie}`,
			},
			body: JSON.stringify(data),
		},
	);

	if (!res.ok) {
		return { status: false, errorMessage: `Server returned ${res.status}` };
	}

	const entry: BracketEntryDto = { slotId, ...data };
	return { status: true, entry };
}

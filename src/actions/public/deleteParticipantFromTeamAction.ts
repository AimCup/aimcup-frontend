"use server";

import { cookies } from "next/headers";
import { client, deleteParticipantFromTeam } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function deleteParticipantFromTeamAction(
	tournamentAbbreviation: string,
	teamId: string,
	participantId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { error } = await deleteParticipantFromTeam({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
			participantId: participantId,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") || "Failed to remove participant",
		};
	}

	await multipleRevalidatePaths([
		`/tournament/${tournamentAbbreviation}/teams/${teamId}`,
		`/tournament/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}`,
		"/",
	]);

	return {
		status: true as const,
	};
}


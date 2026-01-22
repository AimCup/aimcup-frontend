"use server";

import { cookies } from "next/headers";
import { client, disbandTeam } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function disbandTeamAction(
	tournamentAbbreviation: string,
	teamId: string,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	const { error } = await disbandTeam({
		path: {
			abbreviation: tournamentAbbreviation,
			teamId: teamId,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") || "Failed to disband team",
		};
	}

	await multipleRevalidatePaths([
		`/tournament/${tournamentAbbreviation}/teams`,
		`/tournament/${tournamentAbbreviation}`,
		"/",
	]);

	return {
		status: true as const,
	};
}


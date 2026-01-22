"use server";

import { cookies } from "next/headers";
import { client, deleteMatch } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function deleteMatchAction(tournamentAbbreviation: string, matchId: string) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const { error } = await deleteMatch({
		path: {
			abbreviation: tournamentAbbreviation,
			matchId: matchId,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/matches`,
		`/tournament/${tournamentAbbreviation}/schedule`,
	]);

	return {
		status: true as const,
	};
}





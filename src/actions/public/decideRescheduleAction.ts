"use server";

import { cookies } from "next/headers";
import { client, decideMatchReschedule } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function decideRescheduleAction(
	tournamentAbbreviation: string,
	matchId: string,
	isAccepted: boolean,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
	});
	const { data, error } = await decideMatchReschedule({
		path: {
			abbreviation: tournamentAbbreviation,
		},
		body: {
			matchId: matchId,
			isAccepted: isAccepted,
		},
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") || "Failed to decide on reschedule",
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbbreviation}/matches`,
		`/tournament/${tournamentAbbreviation}/schedule`,
	]);

	return {
		status: true as const,
		response: data,
	};
}



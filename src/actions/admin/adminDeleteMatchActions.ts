"use server";

import { cookies } from "next/headers";
import { client, deleteMatch, signInMatchStaffMember } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function signInOutMatchAction(
	tournamentAbbreviation: string,
	matchId: string,
	signIn: boolean,
	type: "REFEREE" | "COMMENTATOR" | "STREAMER",
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const { error } = await signInMatchStaffMember({
		path: {
			abbreviation: tournamentAbbreviation,
			matchId: matchId,
		},
		query: {
			in: signIn,
			type,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") ?? "Failed to update sign-in status",
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





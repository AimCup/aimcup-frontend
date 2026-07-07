"use server";

import { cookies } from "next/headers";
import { client } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

// These endpoints are newer than the committed generated client, so they use the low-level client.
// `npm run regen` against a backend exposing them will produce setMatchResult / revertMatchResult / exportMatches.

function configureClient() {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});
}

function matchPaths(tournamentAbbreviation: string) {
	return [
		`/dashboard/${tournamentAbbreviation}/matches`,
		`/tournament/${tournamentAbbreviation}/schedule`,
	];
}

function errorMessageOf(error: unknown, fallback: string) {
	const e = error as { errors?: string[]; message?: string } | undefined;
	return e?.errors?.join(", ") ?? e?.message ?? fallback;
}

export async function setMatchResultAction(
	tournamentAbbreviation: string,
	matchId: string,
	body: { mpUrl: string; chatLogUrl?: string; redScore?: number; blueScore?: number },
) {
	configureClient();
	const { error } = await client.post({
		url: "/admin/tournaments/{abbreviation}/matches/{matchId}/result",
		path: { abbreviation: tournamentAbbreviation, matchId },
		body,
	});
	if (error) {
		return { status: false as const, errorMessage: errorMessageOf(error, "Failed to save result") };
	}
	await multipleRevalidatePaths(matchPaths(tournamentAbbreviation));
	return { status: true as const };
}

export async function revertMatchResultAction(tournamentAbbreviation: string, matchId: string) {
	configureClient();
	const { error } = await client.delete({
		url: "/admin/tournaments/{abbreviation}/matches/{matchId}/result",
		path: { abbreviation: tournamentAbbreviation, matchId },
	});
	if (error) {
		return { status: false as const, errorMessage: errorMessageOf(error, "Failed to revert result") };
	}
	await multipleRevalidatePaths(matchPaths(tournamentAbbreviation));
	return { status: true as const };
}

export async function exportScheduleAction(tournamentAbbreviation: string) {
	configureClient();
	const { data, error } = await client.post<{ participantCount: number; message: string }>({
		url: "/admin/tournaments/{abbreviation}/matches/spreadsheet-sync",
		path: { abbreviation: tournamentAbbreviation },
	});
	if (error) {
		return { status: false as const, errorMessage: errorMessageOf(error, "Failed to start export") };
	}
	return { status: true as const, response: data };
}

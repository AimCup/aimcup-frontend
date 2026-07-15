"use server";

import { cookies } from "next/headers";
import {
	client,
	deleteBeatmap,
	releaseMappool,
	updateMappoolBeatmap,
	type modification,
	type stageType,
} from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

function configureClient() {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});
}

function mappoolPaths(tournamentAbbreviation: string, stageType: stageType, mappoolId: string) {
	return [
		"/",
		`/dashboard/${tournamentAbbreviation}/mappool/${stageType}/${mappoolId}`,
	];
}

export async function releaseMappoolAction(
	tournamentAbbreviation: string,
	stageType: stageType,
	mappoolId: string,
	release: boolean,
) {
	configureClient();
	const { error } = await releaseMappool({
		path: { stageType, abbreviation: tournamentAbbreviation },
		query: { release },
	});
	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.join(", ") ?? "Failed to update mappool release state",
		};
	}
	await multipleRevalidatePaths(mappoolPaths(tournamentAbbreviation, stageType, mappoolId));
	return { status: true as const };
}

export async function toggleOriginalSongAction(
	tournamentAbbreviation: string,
	stageType: stageType,
	mappoolId: string,
	beatmapId: string,
	isCustomSong: boolean,
) {
	configureClient();
	const { error } = await updateMappoolBeatmap({
		path: { beatmapId },
		body: { isCustomSong },
	});
	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.join(", ") ?? "Failed to update beatmap",
		};
	}
	await multipleRevalidatePaths(mappoolPaths(tournamentAbbreviation, stageType, mappoolId));
	return { status: true as const };
}

export async function toggleCustomMapAction(
	tournamentAbbreviation: string,
	stageType: stageType,
	mappoolId: string,
	beatmapId: string,
	isCustom: boolean,
) {
	configureClient();
	const { error } = await updateMappoolBeatmap({
		path: { beatmapId },
		body: { isCustom },
	});
	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.join(", ") ?? "Failed to update beatmap",
		};
	}
	await multipleRevalidatePaths(mappoolPaths(tournamentAbbreviation, stageType, mappoolId));
	return { status: true as const };
}

export async function deleteBeatmapAction(
	tournamentAbbreviation: string,
	stageType: stageType,
	mappoolId: string,
	beatmapModification: modification,
	beatmapId: string,
) {
	configureClient();
	const { error } = await deleteBeatmap({
		path: {
			abbreviation: tournamentAbbreviation,
			mappoolId,
			modification: beatmapModification,
			beatmapId,
		},
	});
	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.join(", ") ?? "Failed to delete beatmap",
		};
	}
	await multipleRevalidatePaths(mappoolPaths(tournamentAbbreviation, stageType, mappoolId));
	return { status: true as const };
}

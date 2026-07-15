"use server";
import { cookies } from "next/headers";
import {
	addBeatmap,
	addBeatmapsBulk,
	client,
	type BulkBeatmapItemDto,
	type modification,
	type stageType,
} from "../../../client";
import { type AddBeatMapSchemaType } from "@/formSchemas/addBeatMapSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function addBeatMapAction(formData: AddBeatMapSchemaType, stageType: stageType) {
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
	const { data, error } = await addBeatmap({
		path: {
			abbreviation: formData.tournamentAbb,
			modification: formData.modification as modification,
			mappoolId: formData.mappoolId,
		},
		body: {
			url: formData.url,
			position: +formData.position,
			isCustom: formData?.isCustom === "on",
			isCustomSong: formData?.isCustomSong === "on",
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
		`/dashboard/${formData.tournamentAbb}/mappool/${stageType}/${formData.mappoolId}`,
		`/tournament/${formData.tournamentAbb}/mappool/${stageType}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

export async function bulkAddBeatMapsAction(
	tournamentAbb: string,
	mappoolId: string,
	stageType: stageType,
	beatmaps: BulkBeatmapItemDto[],
) {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	if (beatmaps.length === 0) {
		return {
			status: false as const,
			errorMessage: "There are no beatmaps to add.",
		};
	}

	const { data, error } = await addBeatmapsBulk({
		path: {
			abbreviation: tournamentAbb,
			mappoolId,
		},
		body: { beatmaps },
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.join(", ") ?? "Failed to add beatmaps",
		};
	}

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${tournamentAbb}/mappool/${stageType}/${mappoolId}`,
		`/tournament/${tournamentAbb}/mappool/${stageType}`,
	]);

	return {
		status: true as const,
		addedCount: data.length,
	};
}

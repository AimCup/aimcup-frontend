"use server";

import { cookies } from "next/headers";
import { client, updateMatch, type MatchRequestDto } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import { type EditMatchSchemaType } from "@/formSchemas/editMatchSchema";

export async function editMatchAction(formData: EditMatchSchemaType) {
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
	const { data, error } = await updateMatch({
		path: {
			abbreviation: formData.tournamentAbbreviation,
			matchId: formData.matchId,
		},
		body: {
			startDate: formData.dataTimeStart,
			stageType: formData.stageType as MatchRequestDto["stageType"],
			commentatorIds: formData.commentatorIds ?? [],
			refereeIds: formData.refereeIds ?? [],
			streamerIds: formData.streamerIds ?? [],
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
		`/dashboard/${formData.tournamentAbbreviation}/matches`,
		`/tournament/${formData.tournamentAbbreviation}/schedule`,
	]);

	return {
		status: true as const,
		response: data,
	};
}


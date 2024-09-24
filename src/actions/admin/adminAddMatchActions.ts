"use server";

import { cookies } from "next/headers";
import { client, createMatch, type stageType } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import { type AddMachSchemaType } from "@/formSchemas/addMachSchema";

export async function addMatchAction(formData: AddMachSchemaType) {
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
	const { data, error } = await createMatch({
		path: {
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			startDate: formData.dataTimeStart,
			commentatorIds: formData.commentatorIds,
			refereeIds: formData.refereeIds,
			streamerIds: formData.streamerIds,
			stageType: formData.stageType as stageType,
			teamBlueId: formData.teamBlueId,
			teamRedId: formData.teamRedId,
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

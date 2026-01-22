"use server";

import { cookies } from "next/headers";
import { client, rescheduleMatch } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import { type RescheduleMatchSchemaType } from "@/formSchemas/rescheduleMatchSchema";

export async function rescheduleMatchAction(formData: RescheduleMatchSchemaType) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
	});
	const { data, error } = await rescheduleMatch({
		path: {
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			matchId: formData.matchId,
			proposedDateTime: formData.proposedDateTime,
		},
		headers: {
			Cookie: `token=${cookie}`,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", ") || "Failed to reschedule match",
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



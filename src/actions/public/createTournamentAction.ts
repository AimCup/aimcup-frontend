"use server";

import { cookies } from "next/headers";
import {
	client,
	createTournament,
	type qualificationType,
	type tournamentType,
} from "../../../client";
import { type CreateTournamentSchemaType } from "@/formSchemas/createTournamentSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function createTournamentAction(formData: CreateTournamentSchemaType) {
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
	const { data, error } = await createTournament({
		body: {
			name: formData.name,
			abbreviation: formData.abbreviation,
			tournamentType: formData.tournamentType as tournamentType,
			qualificationType: formData.qualificationType as qualificationType,
			minimumRankLimit: +formData.minimumRankLimit,
			maximumRankLimit: +formData.maximumRankLimit,
			minimumTeamSize: +formData.minimumTeamSize,
			maximumTeamSize: +formData.maximumTeamSize,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	await multipleRevalidatePaths(["/", "/dashboard"]);

	return {
		status: true as const,
		response: data,
	};
}

"use server";

import { cookies } from "next/headers";
import { client, updateTournament } from "../../../client";
import { type EditTournamentSchemaType } from "@/formSchemas/editTournamentSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function editTournamentAction(formData: EditTournamentSchemaType, formRules: string) {
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
	const { data, error } = await updateTournament({
		path: {
			abbreviation: formData.oldAbbreviation,
		},
		body: {
			rules: formRules,
			name: formData.name,
			abbreviation: formData.abbreviation,
			prizePool: [
				{ type: 0, prize: formData.prize0 },
				{ type: 1, prize: formData.prize1 },
				{ type: 2, prize: formData.prize2 },
			],
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
		`/dashboard/${formData.abbreviation}`,
		`/dashboard/${formData.abbreviation}/settings`,
		`/tournament/${formData.abbreviation}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

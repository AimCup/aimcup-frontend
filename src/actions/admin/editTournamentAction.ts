"use server";

import { type EditTournamentSchemaType } from "@/formSchemas/editTournamentSchema";
import { updateTournament } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/helpers";

export async function editTournamentAction(formData: EditTournamentSchemaType, formRules: string) {
	"use server";

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

	multipleRevalidatePaths([
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

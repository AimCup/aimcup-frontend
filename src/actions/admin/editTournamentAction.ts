"use server";

import { AdminTournamentService, type UpdateTournamentDataRequestDto } from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type EditTournamentSchemaType } from "@/formSchemas/editTournamentSchema";

export async function editTournamentAction(data: EditTournamentSchemaType, rules: string) {
	"use server";

	return executeFetch(
		AdminTournamentService.updateTournament(data.oldAbbreviation, {
			prizePool: [
				{ type: 0, prize: data.prize0 },
				{ type: 1, prize: data.prize1 },
				{ type: 2, prize: data.prize2 },
			],
			abbreviation: data.abbreviation,
			name: data.name,
			rules: rules,
		}),
		[
			"/",
			`/dashboard/${data.abbreviation}`,
			`/dashboard/${data.abbreviation}/settings`,
			`/tournament/${data.abbreviation}`,
		],
	)
		.then((res) => {
			return res as SuccessfulResponse<UpdateTournamentDataRequestDto>;
		})
		.catch((error) => {
			return error as ErrorResponse;
		});
}

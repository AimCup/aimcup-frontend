"use server";

import { type TeamResponseDto, TeamService } from "../../../generated";
import { type CreateTeamSchemaType } from "@/formSchemas/createTeamSchema";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";

export async function createTeamAction(data: CreateTeamSchemaType) {
	"use server";

	return executeFetch(
		TeamService.createTeam(data.tournamentAbb, {
			name: data.teamName,
			logoUrl: "",
		}),
		["/", "/dashboard", "account"],
	)
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<TeamResponseDto>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

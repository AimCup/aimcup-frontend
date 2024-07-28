"use server";

import {
	AdminTournamentService,
	type TournamentRequestDto,
	type TournamentResponseDto,
} from "../../generated";
import { type CreateTournamentSchemaType } from "@/formSchemas/createTournamentSchema";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";

export async function createTournamentAction(data: CreateTournamentSchemaType) {
	"use server";

	return executeFetch(
		AdminTournamentService.createTournament({
			name: data.name,
			abbreviation: data.abbreviation,
			tournamentType: data.tournamentType as TournamentRequestDto.tournamentType,
			qualificationType: data.qualificationType as TournamentRequestDto.qualificationType,
			minimumRankLimit: +data.minimumRankLimit,
			maximumRankLimit: +data.maximumRankLimit,
			minimumTeamSize: +data.minimumTeamSize,
			maximumTeamSize: +data.maximumTeamSize,
		}),
		["/", "/dashboard"],
	)
		.then((res) => res as SuccessfulResponse<TournamentResponseDto>)
		.catch((error) => error as ErrorResponse);
}

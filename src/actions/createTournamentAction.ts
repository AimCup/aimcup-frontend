"use server";

import {
	AdminTournamentService,
	type TournamentRequestDto,
	type TournamentResponseDto,
} from "../../generated";
import { type CreateTournamentSchemaType } from "@/app/(dashboard)/dashboard/createTournamentSchema";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";

export async function createTournamentAction(data: CreateTournamentSchemaType) {
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
		["/dashboard"],
	)
		.then((res) => res as SuccessfulResponse<TournamentResponseDto>)
		.catch((error) => error as ErrorResponse);

	// try {
	// 	return await AdminTournamentService.createTournament({
	// 		name: data.name,
	// 		abbreviation: data.abbreviation,
	// 		tournamentType: data.tournamentType as TournamentRequestDto.tournamentType,
	// 		qualificationType: data.qualificationType as TournamentRequestDto.qualificationType,
	// 		minimumRankLimit: +data.minimumRankLimit,
	// 		maximumRankLimit: +data.maximumRankLimit,
	// 		minimumTeamSize: +data.minimumTeamSize,
	// 		maximumTeamSize: +data.maximumTeamSize,
	// 	}).then((res) => JSON.stringify(res));
	// } catch (e) {
	// 	return JSON.stringify(e);
	// }
}

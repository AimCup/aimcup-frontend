"use server";

import { type TeamResponseDto, TeamService } from "../../../generated";
import { type CreateTeamSchemaType } from "@/formSchemas/createTeamSchema";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type updateTeamSchemaType } from "@/formSchemas/updateTeamSchema";
import { type inviteToTeamSchemaType } from "@/formSchemas/inviteToTeamSchema";

export async function createTeamAction(data: CreateTeamSchemaType) {
	"use server";

	if (data.terms === "off") {
		return {
			status: false,
			errorMessage: "You need to accept the terms and conditions",
		};
	}

	return executeFetch(
		TeamService.createTeam(data.tournamentAbb, {
			name: data.teamName,
			logoUrl: "",
		}),
		["/", "/tournament/[tournamentId]"],
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

export async function updateTeam(data: updateTeamSchemaType) {
	"use server";

	return executeFetch(
		TeamService.updateTeam(data.tournamentAbbreviation, data.teamId, {
			name: data.name,
			logoUrl: data.logoUrl,
		}),
		["/", "/tournament/[tournamentId]/teams/[teamId]", "/tournament/[tournamentId]"],
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

export async function inviteToTeam(data: inviteToTeamSchemaType) {
	"use server";

	return executeFetch(
		TeamService.inviteParticipant(data.tournamentAbbreviation, data.teamId, data.osuId),
		["/", "/tournament/[tournamentId]/teams/[teamId]", "/tournament/[tournamentId]"],
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

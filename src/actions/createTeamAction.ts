"use server";

import { TeamService } from "../../generated";
import { type CreateTeamSchemaType } from "@/app/(tournament)/tournament/[tournamentId]/registration/createTeamSchema";

export async function createTeamAction(data: CreateTeamSchemaType) {
	"use server";
	const res = await TeamService.createTeam(data.tournamentAbb, {
		name: data.teamName,
		logoUrl: "",
	});

	return res;
}

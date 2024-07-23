"use server";

import { cookies } from "next/headers";
import { OpenAPI, TeamService } from "../../generated";
import { type CreateTeamSchemaType } from "@/app/(tournament)/tournament/[tournamentId]/registration/createTeamSchema";

export async function createTeamAction(data: CreateTeamSchemaType) {
	"use server";

	const token = cookies().get("token")?.value;

	if (token) {
		OpenAPI.HEADERS = {
			Cookie: `token=${token}`,
		};
	}

	try {
		return await TeamService.createTeam(data.tournamentAbb, {
			name: data.teamName,
			logoUrl: "",
		}).then((res) => JSON.stringify(res));
	} catch (e) {
		return JSON.stringify(e);
	}
}

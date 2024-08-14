import * as zod from "zod";

export const updateTeamSchema = zod.object({
	logoUrl: zod.string(),
	name: zod.string(),
	teamId: zod.string(),
	tournamentAbbreviation: zod.string(),
});

export type updateTeamSchemaType = zod.infer<typeof updateTeamSchema>;

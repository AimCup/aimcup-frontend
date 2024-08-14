import * as zod from "zod";

export const createTeamSchema = zod.object({
	teamName: zod.string(),
	tournamentAbb: zod.string(),
	terms: zod.string(),
});

export type CreateTeamSchemaType = zod.infer<typeof createTeamSchema>;

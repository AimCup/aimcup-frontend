import * as zod from "zod";

export const createTeamSchema = zod.object({
	teamName: zod.string(),
	tournamentAbb: zod.string(),
	terms: zod.boolean(),
});

export type CreateTeamSchemaType = zod.infer<typeof createTeamSchema>;

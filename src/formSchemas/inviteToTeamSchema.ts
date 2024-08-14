import * as zod from "zod";

export const inviteToTeamSchema = zod.object({
	osuId: zod.string(),
	teamId: zod.string(),
	tournamentAbbreviation: zod.string(),
});

export type inviteToTeamSchemaType = zod.infer<typeof inviteToTeamSchema>;

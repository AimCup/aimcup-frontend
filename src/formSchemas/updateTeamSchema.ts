import * as zod from "zod";

export const updateTeamSchema = zod.object({
	name: zod.string().min(1, "Team name is required"),
	teamId: zod.string().uuid("Invalid team ID"),
	tournamentAbbreviation: zod.string().min(1, "Tournament abbreviation is required"),
});

export type updateTeamSchemaType = zod.infer<typeof updateTeamSchema>;

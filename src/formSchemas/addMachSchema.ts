import * as zod from "zod";

export const addMatchSchema = zod.object({
	dataTimeStart: zod.string(),
	matchId: zod.string(),
	tournamentAbbreviation: zod.string(),
	stageType: zod.string(),
	teamBlueId: zod.string(),
	teamRedId: zod.string(),
	refereeIds: zod.array(zod.string()).optional(),
	commentatorIds: zod.array(zod.string()).optional(),
	streamerIds: zod.array(zod.string()).optional(),
});

export type AddMachSchemaType = zod.infer<typeof addMatchSchema>;

import * as zod from "zod";

export const editMatchSchema = zod.object({
	matchId: zod.string(),
	tournamentAbbreviation: zod.string(),
	dataTimeStart: zod.string(),
	stageType: zod.string(),
	refereeIds: zod.array(zod.string()).optional(),
	commentatorIds: zod.array(zod.string()).optional(),
	streamerIds: zod.array(zod.string()).optional(),
});

export type EditMatchSchemaType = zod.infer<typeof editMatchSchema>;


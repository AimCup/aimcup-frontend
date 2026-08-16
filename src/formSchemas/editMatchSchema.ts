import * as zod from "zod";

export const editMatchSchema = zod.object({
	// The match's UUID (used as the path param), not the human-facing id below.
	matchId: zod.string(),
	// The custom match id shown everywhere ("A1", "QF2", …). Sent as `matchId` in the request body.
	customMatchId: zod.string().trim().min(1, "Match ID is required"),
	tournamentAbbreviation: zod.string(),
	dataTimeStart: zod.string(),
	stageType: zod.string(),
	refereeIds: zod.array(zod.string()).optional(),
	commentatorIds: zod.array(zod.string()).optional(),
	streamerIds: zod.array(zod.string()).optional(),
});

export type EditMatchSchemaType = zod.infer<typeof editMatchSchema>;


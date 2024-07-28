import * as zod from "zod";

export const addBeatMapSchema = zod.object({
	modification: zod.string(),
	url: zod.string(),
	tournamentAbb: zod.string(),
	mappoolId: zod.string(),
});

export type AddBeatMapSchemaType = zod.infer<typeof addBeatMapSchema>;

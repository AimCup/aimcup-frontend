import * as zod from "zod";

export const addBeatMapSchema = zod.object({
	modification: zod.string(),
	url: zod.string(),
	position: zod.string(),
	tournamentAbb: zod.string(),
	mappoolId: zod.string(),
	isCustom: zod.string().optional(),
});

export type AddBeatMapSchemaType = zod.infer<typeof addBeatMapSchema>;

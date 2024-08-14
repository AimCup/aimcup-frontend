import * as zod from "zod";

export const createStageSchema = zod.object({
	stageType: zod.string(),
	startDate: zod.string(),
	endDate: zod.string(),
	tournamentAbb: zod.string(),
});

export type CreateStageSchemaType = zod.infer<typeof createStageSchema>;

export const editStageSchema = zod.object({
	stageType: zod.string().optional(),
	startDate: zod.string(),
	endDate: zod.string(),
	tournamentAbb: zod.string(),
});

export type EditStageSchemaType = zod.infer<typeof editStageSchema>;

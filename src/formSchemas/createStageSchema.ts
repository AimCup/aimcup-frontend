import * as zod from "zod";

// An unchecked checkbox submits nothing at all, so `undefined` has to read as false rather than
// "not provided". Checked boxes submit the string "on".
const checkbox = zod.preprocess((val) => val === "on" || val === true, zod.boolean());

export const createStageSchema = zod.object({
	stageType: zod.string(),
	startDate: zod.string(),
	endDate: zod.string(),
	showInSchedule: checkbox,
	tournamentAbb: zod.string(),
});

export type CreateStageSchemaType = zod.infer<typeof createStageSchema>;

export const editStageSchema = zod.object({
	stageType: zod.string().optional(),
	startDate: zod.string(),
	endDate: zod.string(),
	showInSchedule: checkbox,
	tournamentAbb: zod.string(),
});

export type EditStageSchemaType = zod.infer<typeof editStageSchema>;

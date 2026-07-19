import * as zod from "zod";

export const mappoolNameSchema = zod.object({
	tournamentAbb: zod.string(),
	stageType: zod.string(),
	// Empty is meaningful: it clears the override so the pool falls back to its stage's name.
	displayName: zod.string().max(60, "Keep it under 60 characters."),
});

export type MappoolNameSchemaType = zod.infer<typeof mappoolNameSchema>;

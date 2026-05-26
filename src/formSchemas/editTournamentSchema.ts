import * as zod from "zod";

export const editTournamentSchema = zod.object({
	name: zod.string(),
	abbreviation: zod.string(),
	oldAbbreviation: zod.string(),
	matchSize: zod.string().optional(),
	prize0: zod.string(),
	prize1: zod.string(),
	prize2: zod.string(),
});

export type EditTournamentSchemaType = zod.infer<typeof editTournamentSchema>;

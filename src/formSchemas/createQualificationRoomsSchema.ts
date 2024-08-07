import * as zod from "zod";

export const createQualificationRoomsSchema = zod.object({
	amount: zod.string(),
	offset: zod.string(),
	dataTimeStart: zod.string(),
	tournamentAbbreviation: zod.string(),
});

export type CreateQualificationRoomsSchemaType = zod.infer<typeof createQualificationRoomsSchema>;

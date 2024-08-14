import * as zod from "zod";

export const editQualificationRoomsSchema = zod.object({
	staffMemberId: zod.string().optional(),
	rosterIds: zod.array(zod.string()).optional(),
	dataTimeStart: zod.string(),
	roomId: zod.string(),
	tournamentAbbreviation: zod.string(),
});

export type EditQualificationRoomsSchemaType = zod.infer<typeof editQualificationRoomsSchema>;

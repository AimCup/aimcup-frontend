import * as zod from "zod";

export const addEditUserLessStaffMembersSchema = zod.object({
	roles: zod.array(zod.string()).optional(),
	username: zod.string(),
	redirectUrl: zod.string(),
	imageUrl: zod.string(),
	tournamentAbbreviation: zod.string(),
});

export type AddUserLessStaffMembersSchemaType = zod.infer<typeof addEditUserLessStaffMembersSchema>;

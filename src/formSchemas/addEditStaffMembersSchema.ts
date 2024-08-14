import * as zod from "zod";

export const addEditStaffMembersSchema = zod.object({
	osuId: zod.string(),
	discordId: zod.string().optional(),
	roles: zod.array(zod.string()).optional(),
	permissions: zod.array(zod.string()).optional(),
	tournamentAbbreviation: zod.string(),
});

export type AddStaffMembersSchemaType = zod.infer<typeof addEditStaffMembersSchema>;

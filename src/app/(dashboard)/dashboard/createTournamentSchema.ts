import * as zod from "zod";

export const createTournamentSchema = zod.object({
	name: zod
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(16, "Name must be at most 16 characters long")
		.nonempty("Name cannot be empty"),
	abbreviation: zod
		.string()
		.nonempty()
		.min(3, "Abbreviation must be at most 3 characters long")
		.max(4, "Abbreviation must be at most 4 characters long"),
	tournamentType: zod.string().nonempty(),
	qualificationType: zod.string().nonempty(),
	minimumRankLimit: zod.string(),
	maximumRankLimit: zod.string(),
	minimumTeamSize: zod.string(),
	maximumTeamSize: zod.string(),
});

export type CreateTournamentSchemaType = zod.infer<typeof createTournamentSchema>;

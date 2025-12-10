import * as zod from "zod";

export const rescheduleMatchSchema = zod.object({
	matchId: zod.string().uuid(),
	proposedDateTime: zod.string().min(1, "Date and time is required"),
	tournamentAbbreviation: zod.string(),
	agreeToRules: zod
		.preprocess(
			(val) => {
				// Convert checkbox value ("on" or undefined) to boolean
				if (val === "on" || val === true) return true;
				if (val === undefined || val === null || val === false) return false;
				return Boolean(val);
			},
			zod.boolean().refine((val) => val === true, {
				message: "You must agree to the reschedule rules",
			}),
		),
});

export type RescheduleMatchSchemaType = zod.infer<typeof rescheduleMatchSchema>;


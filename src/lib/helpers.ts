import { type MutableRefObject } from "react";
import { type z, type ZodObject, type ZodRawShape } from "zod";
import { type StageResponseDto, tournamentType } from "../../client";

export const stageTypeEnumToString = (stageType: StageResponseDto["stageType"]) => {
	switch (stageType) {
		case "REGISTRATION":
			return "Registration";
		case "QUALIFICATION":
			return "Qualification";
		case "FINAL":
			return "Final";
		case "RO16":
			return "Round of 16";
		case "RO64":
			return "Round of 64";
		case "GRAND_FINAL":
			return "Grand Final";
		case "QUARTER_FINAL":
			return "Quarter Final";
		case "RO32":
			return "Round of 32";
		case "RO128":
			return "Round of 128";
		case "SEMI_FINAL":
			return "Semi Final";
		case "SCREENING":
			return "Screening";
		case "SWISS_1":
			return "Swiss Stage 1";
		case "SWISS_2":
			return "Swiss Stage 2";
		case "SWISS_3":
			return "Swiss Stage 3";
		case "SWISS_4":
			return "Swiss Stage 4";
		case "SWISS_5":
			return "Swiss Stage 5";
		case "SWISS_6":
			return "Swiss Stage 6";
		default:
			return "Unknown";
	}
};

export const tournamentTeamShowEnumAvailable = [
	tournamentType.TEAM_VS,
	tournamentType.INTERNATIONAL,
	tournamentType.AUCTION,
];

export const resetFormValues = <T extends ZodObject<ZodRawShape>>({
	formRef,
	schema,
	resetWithoutInputNames = [],
}: {
	formRef: MutableRefObject<HTMLFormElement | null>;
	schema: T;
	resetWithoutInputNames?: (keyof z.infer<T>)[];
}) => {
	if (!formRef?.current) return;

	const inputs = formRef.current.querySelectorAll<
		HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	>("input, select, textarea");

	const schemaKeys = Object.keys(schema.shape) as (keyof z.infer<T>)[];

	inputs.forEach((input) => {
		if (
			schemaKeys.includes(input.name as keyof z.infer<T>) &&
			!resetWithoutInputNames.includes(input.name as keyof z.infer<T>)
		) {
			if (input.type === "checkbox") {
				(input as HTMLInputElement).checked = false;
			} else {
				input.value = "";
			}
		}
	});
};

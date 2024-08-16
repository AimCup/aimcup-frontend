import { type MutableRefObject } from "react";
import { type z, type ZodObject, type ZodRawShape } from "zod";
import { type StageResponseDto, tournamentType } from "../../client";
import { revalidatePath } from "next/cache";

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
		default:
			return "Unknown";
	}
};

export const tournamentTeamShowEnumAvailable = [
	tournamentType.TEAM_VS,
	tournamentType.INTERNATIONAL,
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
			input.value = "";
		}
	});
};

export const multipleRevalidatePaths = (paths: string[]) => {
	"use server";
	paths.forEach((path) => {
		revalidatePath(path);
	});
};

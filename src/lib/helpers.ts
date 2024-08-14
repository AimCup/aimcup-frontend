import { type MutableRefObject } from "react";
import { type z, type ZodObject, type ZodRawShape } from "zod";
import { StageResponseDto, TournamentRequestDto } from "../../generated";
import tournamentType = TournamentRequestDto.tournamentType;

export const stageTypeEnumToString = (stageType: StageResponseDto["stageType"]) => {
	switch (stageType) {
		case StageResponseDto.stageType.REGISTRATION:
			return "Registration";
		case StageResponseDto.stageType.QUALIFICATION:
			return "Qualification";
		case StageResponseDto.stageType.FINAL:
			return "Final";
		case StageResponseDto.stageType.RO16:
			return "Round of 16";
		case StageResponseDto.stageType.RO64:
			return "Round of 64";
		case StageResponseDto.stageType.GRAND_FINAL:
			return "Grand Final";
		case StageResponseDto.stageType.QUARTER_FINAL:
			return "Quarter Final";
		case StageResponseDto.stageType.RO32:
			return "Round of 32";
		case StageResponseDto.stageType.RO128:
			return "Round of 128";
		case StageResponseDto.stageType.SEMI_FINAL:
			return "Semi Final";
		case StageResponseDto.stageType.SCREENING:
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

import { StageResponseDto } from "../../generated";

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

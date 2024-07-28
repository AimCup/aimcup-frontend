"use server";

import { type StageResponseDto, StageService } from "../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type CreateStageSchemaType } from "@/formSchemas/createStageSchema";

export async function createStageAction(data: CreateStageSchemaType) {
	"use server";

	return executeFetch(
		StageService.createStage(data.tournamentAbb, {
			endDate: new Date(data.endDate).toISOString(),
			stageType: data.stageType as StageResponseDto.stageType,
			startDate: new Date(data.startDate).toISOString(),
		}),
		["/", "/dashboard"],
	)
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<StageResponseDto>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

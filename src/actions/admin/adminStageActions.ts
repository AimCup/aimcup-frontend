"use server";

import { AdminStageService, type StageResponseDto } from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type CreateStageSchemaType, type EditStageSchemaType } from "@/formSchemas/createStageSchema";

export async function createStageAction(data: CreateStageSchemaType) {
	"use server";

	return executeFetch(
		AdminStageService.createStage(data.tournamentAbb, {
			endDate: new Date(data.endDate).toISOString(),
			stageType: data.stageType as StageResponseDto.stageType,
			startDate: new Date(data.startDate).toISOString(),
		}),
		["/", "/dashboard/[tournamentAbbreviation]"],
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
export async function editStageAction(data: EditStageSchemaType) {
	"use server";

	return executeFetch(
		AdminStageService.updateStage(
			data.tournamentAbb,
			data.stageType as StageResponseDto.stageType,
			{
				endDate: new Date(data.endDate).toISOString(),
				startDate: new Date(data.startDate).toISOString(),
			},
		),
		["/", "/dashboard/[tournamentAbbreviation]"],
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

"use server";

import {
	AdminMappoolService,
	type BeatmapModificationResponseDto,
	type BeatmapResponseDto,
} from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type AddBeatMapSchemaType } from "@/formSchemas/addBeatMapSchema";

export async function addBeatMapAction(data: AddBeatMapSchemaType) {
	"use server";

	return executeFetch(
		AdminMappoolService.addBeatmap(
			data.tournamentAbb,
			data.mappoolId,
			data.modification as BeatmapModificationResponseDto.modification,
			{
				url: data.url,
				position: +data.position,
				isCustom: data?.isCustom === "on",
			},
		),
		["/", "/dashboard/[tournamentAbb]/mappool/[stageType]/[mappoolId]"],
	)
		.then((res) => {
			return res as SuccessfulResponse<BeatmapResponseDto>;
		})
		.catch((error) => {
			return error as ErrorResponse;
		});
}

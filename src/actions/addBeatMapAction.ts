"use server";

import {
	type BeatmapModificationResponseDto,
	type BeatmapResponseDto,
	MappoolService,
} from "../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type AddBeatMapSchemaType } from "@/formSchemas/addBeatMapSchema";

export async function addBeatMapAction(data: AddBeatMapSchemaType) {
	"use server";

	return executeFetch(
		MappoolService.addBeatmap(
			data.tournamentAbb,
			data.mappoolId,
			data.modification as BeatmapModificationResponseDto.modification,
			{
				url: data.url,
			},
		),
		["/", "/dashboard"],
	)
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<BeatmapResponseDto>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

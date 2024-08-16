"use server";
import { addBeatmap, type modification } from "../../../client";
import { type AddBeatMapSchemaType } from "@/formSchemas/addBeatMapSchema";

export async function addBeatMapAction(formData: AddBeatMapSchemaType) {
	"use server";

	const { data, error } = await addBeatmap({
		path: {
			abbreviation: formData.tournamentAbb,
			modification: formData.modification as modification,
			mappoolId: formData.mappoolId,
		},
		body: {
			url: formData.url,
			position: +formData.position,
			isCustom: formData?.isCustom === "on",
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	// todo: ADD REVALIDATE_PATHS

	return {
		status: true as const,
		response: data,
	};
}

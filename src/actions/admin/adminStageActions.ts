"use server";

import {
	type CreateStageSchemaType,
	type EditStageSchemaType,
} from "@/formSchemas/createStageSchema";
import { createStage, stageType, updateStage } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/helpers";

export async function createStageAction(formData: CreateStageSchemaType) {
	"use server";

	const { data, error } = await createStage({
		path: {
			abbreviation: formData.tournamentAbb,
		},
		body: {
			startDate: new Date(formData.startDate).toISOString(),
			endDate: new Date(formData.endDate).toISOString(),
			stageType: formData.stageType as stageType,
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}
export async function editStageAction(formData: EditStageSchemaType) {
	"use server";

	const { data, error } = await updateStage({
		path: {
			abbreviation: formData.tournamentAbb,
			stageType: formData.stageType as stageType,
		},
		body: {
			startDate: new Date(formData.startDate).toISOString(),
			endDate: new Date(formData.endDate).toISOString(),
		},
	});

	if (error) {
		return {
			status: false as const,
			errorMessage: error.errors?.map((e) => e).join(", "),
		};
	}

	multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

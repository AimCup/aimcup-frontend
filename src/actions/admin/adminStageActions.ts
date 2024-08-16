"use server";

import { cookies } from "next/headers";
import { client, createStage, type stageType, updateStage } from "../../../client";
import {
	type CreateStageSchemaType,
	type EditStageSchemaType,
} from "@/formSchemas/createStageSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function createStageAction(formData: CreateStageSchemaType) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
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

	await multipleRevalidatePaths([
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
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
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

	await multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbb}`,
		`/tournament/${formData.tournamentAbb}`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

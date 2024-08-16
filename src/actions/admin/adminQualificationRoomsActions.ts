"use server";

import { cookies } from "next/headers";
import { client, createQualificationRooms, updateQualificationRoom } from "../../../client";
import { type CreateQualificationRoomsSchemaType } from "@/formSchemas/createQualificationRoomsSchema";
import { type EditQualificationRoomsSchemaType } from "@/formSchemas/editQualificationRoomSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

export async function createQualificationRoomsAction(formData: CreateQualificationRoomsSchemaType) {
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
	const { data, error } = await createQualificationRooms({
		path: {
			abbreviation: formData.tournamentAbbreviation,
		},
		body: {
			amount: +formData.amount,
			timeOffset: +formData.offset,
			startDateTime: formData.dataTimeStart,
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
		`/dashboard/${formData.tournamentAbbreviation}/qualification-rooms`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

export async function editQualificationRoomsAction(formData: EditQualificationRoomsSchemaType) {
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
	const { data, error } = await updateQualificationRoom({
		path: {
			abbreviation: formData.tournamentAbbreviation,
			roomId: formData.roomId,
		},
		body: {
			rosterIds: formData.rosterIds?.map((roster) => roster),
			staffMemberId: formData.staffMemberId,
			startDate: formData.dataTimeStart,
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
		`/dashboard/${formData.tournamentAbbreviation}/qualification-rooms`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

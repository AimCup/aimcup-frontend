"use server";

import { type CreateQualificationRoomsSchemaType } from "@/formSchemas/createQualificationRoomsSchema";
import { type EditQualificationRoomsSchemaType } from "@/formSchemas/editQualificationRoomSchema";
import { createQualificationRooms, updateQualificationRoom } from "../../../client";
import { multipleRevalidatePaths } from "@/lib/helpers";

export async function createQualificationRoomsAction(formData: CreateQualificationRoomsSchemaType) {
	"use server";

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

	multipleRevalidatePaths([
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

	multipleRevalidatePaths([
		"/",
		`/dashboard/${formData.tournamentAbbreviation}/qualification-rooms`,
	]);

	return {
		status: true as const,
		response: data,
	};
}

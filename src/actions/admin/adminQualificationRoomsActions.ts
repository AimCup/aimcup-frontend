"use server";

import { cookies } from "next/headers";
import {
	client,
	createQualificationRooms,
	deleteQualificationRoom,
	signInOutQualificationRoom,
	updateQualificationRoom,
} from "../../../client";
import { type CreateQualificationRoomsSchemaType } from "@/formSchemas/createQualificationRoomsSchema";
import { type EditQualificationRoomsSchemaType } from "@/formSchemas/editQualificationRoomSchema";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

function configureClient() {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});
}

function qualificationRoomPaths(tournamentAbbreviation: string) {
	return [
		`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
		`/tournament/${tournamentAbbreviation}/qualification-rooms`,
	];
}

export async function signInOutQualificationRoomAction(
	tournamentAbbreviation: string,
	roomId: string,
	signIn: boolean,
) {
	configureClient();
	const { error } = await signInOutQualificationRoom({
		path: { abbreviation: tournamentAbbreviation, roomId },
		query: { in: signIn },
	});
	if (error) {
		return { status: false as const, errorMessage: error.errors?.join(", ") ?? "Failed to update referee" };
	}
	await multipleRevalidatePaths(qualificationRoomPaths(tournamentAbbreviation));
	return { status: true as const };
}

export async function deleteQualificationRoomAction(tournamentAbbreviation: string, roomId: string) {
	configureClient();
	const { error } = await deleteQualificationRoom({
		path: { abbreviation: tournamentAbbreviation, roomId },
	});
	if (error) {
		return { status: false as const, errorMessage: error.errors?.join(", ") ?? "Failed to delete room" };
	}
	await multipleRevalidatePaths(qualificationRoomPaths(tournamentAbbreviation));
	return { status: true as const };
}

export async function exportQualificationRoomsAction(tournamentAbbreviation: string) {
	configureClient();
	// Called via the low-level client because this endpoint is newer than the committed generated client.
	// `npm run regen` against a backend exposing it will produce an `exportQualificationRooms` helper.
	const { data, error } = await client.post<{ participantCount: number; message: string }>({
		url: "/admin/tournaments/{abbreviation}/qualification-rooms/spreadsheet-sync",
		path: { abbreviation: tournamentAbbreviation },
	});
	if (error) {
		return {
			status: false as const,
			errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Failed to start export",
		};
	}
	return { status: true as const, response: data };
}

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

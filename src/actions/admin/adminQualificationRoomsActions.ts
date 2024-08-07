"use server";

import { AdminQualificationService, type AdminStaffMemberService } from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type CreateQualificationRoomsSchemaType } from "@/formSchemas/createQualificationRoomsSchema";
import { type EditQualificationRoomsSchemaType } from "@/formSchemas/editQualificationRoomSchema";

export async function createQualificationRoomsAction(data: CreateQualificationRoomsSchemaType) {
	"use server";

	return executeFetch(
		AdminQualificationService.createQualificationRooms(data.tournamentAbbreviation, {
			amount: +data.amount,
			timeOffset: +data.offset,
			startDateTime: data.dataTimeStart,
		}),
		["/", "/dashboard/[tournamentAbb]/qualification-rooms"],
	)
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<AdminStaffMemberService>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

export async function editQualificationRoomsAction(data: EditQualificationRoomsSchemaType) {
	"use server";

	return executeFetch(
		AdminQualificationService.updateQualificationRoom(
			data.tournamentAbbreviation,
			data.roomId,
			{
				rosterIds: data.rosterIds,
				staffMemberId: data.staffMemberId,
				startDate: data.dataTimeStart,
			},
		),
		["/", "/dashboard/[tournamentAbb]/qualification-rooms"],
	)
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<AdminStaffMemberService>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

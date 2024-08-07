"use server";

import { AdminStaffMemberService } from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type AddStaffMembersSchemaType } from "@/formSchemas/addEditStaffMembersSchema";

export async function editStaffMemberAction(data: AddStaffMembersSchemaType) {
	"use server";

	return executeFetch(
		AdminStaffMemberService.updateStaffMembers(data.tournamentAbbreviation, data.osuId, {
			discordId: data.discordId,
			roles: data.roles,
			permissions: data.permissions,
		}),
		["/", "/dashboard/[tournamentAbb]/staff-members"],
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

export async function addStaffMemberAction(data: AddStaffMembersSchemaType) {
	"use server";

	return executeFetch(
		AdminStaffMemberService.addStaffMembers(data.tournamentAbbreviation, {
			osuId: data.osuId,
			discordId: data.discordId,
			roles: data.roles || [],
			permissions: data.permissions || [],
		}),
		["/", "/dashboard/[tournamentAbb]/staff-members"],
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

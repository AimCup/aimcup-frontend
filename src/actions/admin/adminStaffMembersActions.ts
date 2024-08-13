"use server";

import { AdminStaffMemberService } from "../../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";
import { type AddStaffMembersSchemaType } from "@/formSchemas/addEditStaffMembersSchema";
import { AddUserLessStaffMembersSchemaType } from "@/formSchemas/addEditUserLessStaffMembersSchema";

export async function editStaffMemberAction(data: AddStaffMembersSchemaType) {
	"use server";

	return executeFetch(
		AdminStaffMemberService.updateStaffMembers(data.tournamentAbbreviation, data.osuId, {
			discordId: data.discordId,
			roles: data.roles,
			permissions: data.permissions,
		}),
		["/", `/dashboard/${data.tournamentAbbreviation}/staff-members`],
	)
		.then((res) => {
			return res as SuccessfulResponse<AdminStaffMemberService>;
		})
		.catch((error) => {
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
		["/", `/dashboard/${data.tournamentAbbreviation}/staff-members`],
	)
		.then((res) => {
			return res as SuccessfulResponse<AdminStaffMemberService>;
		})
		.catch((error) => {
			return error as ErrorResponse;
		});
}

export async function addUserLessStaffMemberAction(data: AddUserLessStaffMembersSchemaType) {
	"use server";

	return executeFetch(
		AdminStaffMemberService.addStaffMembers(data.tournamentAbbreviation, {
			roles: data.roles || [],
			username: data.username,
			redirectUrl: data.redirectUrl,
			imageUrl: data.imageUrl,
		}),
		["/", `/dashboard/${data.tournamentAbbreviation}/staff-members`],
	)
		.then((res) => {
			return res as SuccessfulResponse<AdminStaffMemberService>;
		})
		.catch((error) => {
			return error as ErrorResponse;
		});
}

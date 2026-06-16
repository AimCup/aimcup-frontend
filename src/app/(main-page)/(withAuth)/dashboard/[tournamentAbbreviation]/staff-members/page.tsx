import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import {
	client,
	getStaffMembers1,
	getTournamentPermissions,
	getTournamentRoles,
} from "../../../../../../../client";
import { StaffMemberModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/staff-members/StaffMemberModal";
import type { selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { UserLessStaffMemberModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/staff-members/UserLessStaffMemberModal";
import { DeleteStaffMemberButton } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/staff-members/StaffMemberRowActions";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const StaffMembersPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
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

	// Fetch all independent data in parallel.
	const [
		{ data: getRoles },
		{ data: getPermissions },
		{ data: getStaffMembers },
	] = await Promise.all([
		getTournamentRoles({ path: { abbreviation: tournamentAbbreviation } }),
		getTournamentPermissions({ path: { abbreviation: tournamentAbbreviation } }),
		getStaffMembers1({ path: { abbreviation: tournamentAbbreviation } }),
	]);

	const rolesSelectOptions: selectOptions[] =
		getRoles?.map((role) => ({
			id: role.id,
			label: role.name,
		})) || [];

	const permissionsSelectOptions: selectOptions[] =
		getPermissions?.permissions?.map((permission) => ({
			id: permission,
			label: permission,
		})) || [];

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Staff members"
				subtitle="Manage tournament staff: add, edit roles, permissions, and remove members."
				actions={
					<>
						<StaffMemberModal
							rolesSelectOptions={rolesSelectOptions}
							permissionsSelectOptions={permissionsSelectOptions}
							tournamentAbb={tournamentAbbreviation}
							modalType={{
								type: "add",
							}}
						/>
						<UserLessStaffMemberModal
							tournamentAbb={tournamentAbbreviation}
							rolesSelectOptions={rolesSelectOptions}
							modalType={{ type: "add" }}
						/>
					</>
				}
			/>

			<Card className="p-0">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Osu ID</th>
								<th>User name</th>
								<th>Discord ID</th>
								<th>Roles</th>
								<th>Permissions</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{!getStaffMembers || getStaffMembers.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-8 text-center text-white/40">
										No staff members yet.
									</td>
								</tr>
							) : (
								getStaffMembers.map((s) => (
									<tr key={s.id}>
										<td>{s.user ? s.user.osuId : "-"}</td>
										<td>
											<div className="flex items-center gap-2">
												<div className="avatar">
													<div className="mask mask-squircle h-7 w-7">
														<Image
															src={
																(s.user
																	? `https://a.ppy.sh/${s.user.osuId}`
																	: s?.imageUrl) || ""
															}
															alt="Avatar"
															width={28}
															height={28}
														/>
													</div>
												</div>
												<span className="truncate">{s.user ? s.user.username : s.username}</span>
											</div>
										</td>
										<td>{s.user ? s.discordId : "-"}</td>
										<td>
											{s.roles?.map((role) => (
												<span
													key={role.id}
													className="badge badge-ghost badge-sm block"
												>
													{role.name}
												</span>
											))}
										</td>
										<td>
											{s.user
												? s.permissions?.map((permission) => (
														<span
															key={permission}
															className="badge badge-ghost badge-sm block"
														>
															{permission}
														</span>
													))
												: "-"}
										</td>
										<td>
											<div className="flex items-center gap-1">
												{s.user && (
													<StaffMemberModal
														rolesSelectOptions={rolesSelectOptions}
														permissionsSelectOptions={permissionsSelectOptions}
														tournamentAbb={tournamentAbbreviation}
														modalType={{
															type: "edit",
															user: {
																osuId: "" + s.id,
																discordId: "" + s.discordId,
																roles:
																	s.roles?.map((role) => {
																		return {
																			id: role.id,
																			label: role.name,
																		};
																	}) || [],
																permissions:
																	s.permissions?.map((permission) => {
																		return {
																			id: permission,
																			label: permission,
																		};
																	}) || [],
															},
														}}
													/>
												)}
												<DeleteStaffMemberButton
													tournamentAbbreviation={tournamentAbbreviation}
													staffMemberId={s.id}
													displayName={s.user ? s.user.username : s.username || s.id}
												/>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};

export default StaffMembersPage;

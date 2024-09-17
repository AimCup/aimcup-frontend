import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { cookies } from "next/headers";
import {
	client,
	deleteQualificationRoom,
	getParticipants,
	getQualificationRooms,
	getStaffMembers1,
	getTeamsByTournament,
	getTournamentByAbbreviation,
	getTournamentStaffMember,
	type QualificationRoomResponseDto,
	signInOutQualificationRoom,
	tournamentType,
} from "../../../../../../../client";
import { QualificationRoomModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/QualificationRoomModal";
import { type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { getUser } from "@/actions/public/getUserAction";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import {
	type ParticipantBasedQualificationRoom,
	type TeamBasedQualificationRoom,
} from "@/models/QualificationRoom";

const qualificationRooms = (
	rooms: QualificationRoomResponseDto[],
): (TeamBasedQualificationRoom | ParticipantBasedQualificationRoom)[] => {
	return rooms
		.map((room) => {
			if (room.tournamentType !== tournamentType.PARTICIPANT_VS) {
				return room as TeamBasedQualificationRoom;
			} else {
				return room as ParticipantBasedQualificationRoom;
			}
		})
		.sort((a, b) => {
			return a.startDate > b.startDate ? 1 : -1;
		});
};

const QRoomsPage = async ({
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
	const userData = await getUser();
	const { data: getStaffForATournamentUser } = await getTournamentStaffMember({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const { data: getQualificationRoomsData } = await getQualificationRooms({
		path: { abbreviation: tournamentAbbreviation },
	});

	const { data: getStaffMembers } = await getStaffMembers1({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const { data: getTournament } = await getTournamentByAbbreviation({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const staffMemberSelectOptions: selectOptions[] =
		getStaffMembers
			?.filter((s) => s.user)
			?.map((staffMember) => ({
				id: staffMember.id,
				label: staffMember.user ? staffMember.user.username : staffMember.username || "",
			})) || [];

	let rostersSelectOptions: selectOptions[] = [];
	if (getTournament?.tournamentType !== tournamentType.PARTICIPANT_VS) {
		const { data: getTeams } = await getTeamsByTournament({
			path: {
				abbreviation: tournamentAbbreviation,
			},
		});
		rostersSelectOptions =
			getTeams?.map((team) => ({
				id: team.id,
				label: team.name,
			})) || [];
	} else {
		const { data: getParticipantsData } = await getParticipants({
			path: {
				abbreviation: tournamentAbbreviation,
			},
		});
		rostersSelectOptions =
			getParticipantsData?.map((participant) => ({
				id: participant.id,
				label: participant.user.username,
			})) || [];
	}

	const canSignIn =
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some(
				(permission) => permission === "QUALIFICATION_ROOM_STAFF_MEMBER_SIGN_IN",
			),
		) ||
		getStaffForATournamentUser?.permissions?.some(
			(permission) => permission === "QUALIFICATION_ROOM_STAFF_MEMBER_SIGN_IN",
		);

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Qualification rooms</h2>
			<QualificationRoomModal
				tournamentAbb={tournamentAbbreviation}
				modalType={{
					type: "add",
				}}
			/>

			<div className="mt-3 overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>Number</th>
							<th>Start date time</th>
							<th>Roster</th>
							<th>Referee</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{qualificationRooms(getQualificationRoomsData || []).map((room) => (
							<tr key={room.id}>
								<td>{room.number}</td>
								<td>{format(new Date(room.startDate), "dd/MM/yyyy HH:mm")}</td>
								<td className={"flex flex-col gap-2"}>
									{room.tournamentType === tournamentType.PARTICIPANT_VS
										? (
												room as ParticipantBasedQualificationRoom
											).participants.map((participant) => (
												<div key={participant.id}>
													{participant.user.username}
												</div>
											))
										: (room as TeamBasedQualificationRoom).teams.map((team) => (
												<div
													key={team.id}
													className={"flex gap-2 truncate"}
												>
													<Image
														src={team.logoUrl || "/aim_logo.svg"}
														alt={team.name}
														width={20}
														height={20}
													/>
													{team.name}
												</div>
											))}
								</td>
								<td>
									{room.staffMember ? (
										userData?.id === room.staffMember.user?.id ? (
											<form
												action={async (_e) => {
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
													await signInOutQualificationRoom({
														path: {
															abbreviation: tournamentAbbreviation,
															roomId: room.id,
														},
														query: {
															in: false,
														},
													});
													await multipleRevalidatePaths([
														"/",
														`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
													]);
												}}
											>
												<button
													className="btn btn-ghost btn-xs"
													type={"submit"}
												>
													sign out
												</button>
											</form>
										) : (
											<div className={"flex items-center gap-2"}>
												<div className="avatar">
													<div className="mask mask-squircle h-5 w-5">
														<Image
															src={`https://a.ppy.sh/${room.staffMember.user?.osuId}`}
															alt="Avatar Tailwind CSS Component"
															width={20}
															height={20}
														/>
													</div>
												</div>
												{room.staffMember.user?.username}
											</div>
										)
									) : canSignIn ? (
										<form
											action={async (_e) => {
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
												await signInOutQualificationRoom({
													path: {
														abbreviation: tournamentAbbreviation,
														roomId: room.id,
													},
													query: {
														in: true,
													},
												});
												await multipleRevalidatePaths([
													"/",
													`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
												]);
											}}
										>
											<button
												className="btn btn-ghost btn-xs"
												type={"submit"}
											>
												sign in
											</button>
										</form>
									) : (
										"-"
									)}
								</td>
								<td>
									<QualificationRoomModal
										modalType={{
											type: "edit",
											room: {
												selectedStaffMemberOption: [
													{
														id: room.staffMember?.id,
														label:
															room.staffMember?.user?.username || "",
													},
												],
												roomId: room.id,
												dataTimeStart: room.startDate,
												selectedRosterIds:
													room.tournamentType ===
													tournamentType.PARTICIPANT_VS
														? (
																room as ParticipantBasedQualificationRoom
															).participants.map((participant) => ({
																id: participant.id,
																label: participant.user.username,
															}))
														: (
																room as TeamBasedQualificationRoom
															).teams.map((team) => ({
																id: team.id,
																label: team.name,
															})),
											},
											staffMemberSelectOptions,
											rostersSelectOptions,
										}}
										tournamentAbb={tournamentAbbreviation}
									/>
									<form
										action={async (_e) => {
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
											await deleteQualificationRoom({
												path: {
													abbreviation: tournamentAbbreviation,
													roomId: room.id,
												},
											});
											await multipleRevalidatePaths([
												"/",
												`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
											]);
										}}
									>
										<button className="btn btn-ghost btn-xs" type={"submit"}>
											delete
										</button>
									</form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default QRoomsPage;

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { cookies } from "next/headers";
import {
	client,
	getParticipants,
	getQualificationRooms,
	getStaffMembers1,
	getTeamsByTournament,
	getTournamentByAbbreviation,
	getTournamentStaffMember,
	type QualificationRoomResponseDto,
	tournamentType,
} from "../../../../../../../client";
import { QualificationRoomModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/QualificationRoomModal";
import {
	DeleteRoomButton,
	RefereeSignButton,
} from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/QualificationRoomRowActions";
import ExportQualificationRoomsButton from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/ExportQualificationRoomsButton";
import SignInLockSetting from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/SignInLockSetting";
import { type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { getUser } from "@/actions/public/getUserAction";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";
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

	// Fetch all independent data in parallel (previously a sequential waterfall of 5+ round-trips).
	const [
		userData,
		{ data: getStaffForATournamentUser },
		{ data: getQualificationRoomsData },
		{ data: getStaffMembers },
		{ data: getTournament },
	] = await Promise.all([
		getUser(),
		getTournamentStaffMember({ path: { abbreviation: tournamentAbbreviation } }),
		getQualificationRooms({ path: { abbreviation: tournamentAbbreviation } }),
		getStaffMembers1({ path: { abbreviation: tournamentAbbreviation } }),
		getTournamentByAbbreviation({ path: { abbreviation: tournamentAbbreviation } }),
	]);

	const staffMemberSelectOptions: selectOptions[] =
		getStaffMembers
			?.filter((s) => s.user)
			?.map((staffMember) => ({
				id: staffMember.id,
				label: staffMember.user ? staffMember.user.username : staffMember.username || "",
			})) || [];

	let rostersSelectOptions: selectOptions[] = [];
	const isParticipantBased =
		getTournament?.tournamentType === tournamentType.PARTICIPANT_VS ||
		getTournament?.tournamentType === tournamentType.AUCTION;
	if (!isParticipantBased) {
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

	const rooms = qualificationRooms(getQualificationRoomsData || []);
	const myRooms = rooms.filter(
		(room) => userData?.id && room.staffMember?.user?.id === userData.id,
	);

	// TODO: after `npm run regen` adds qualificationSignInLockHours to TournamentResponseDto,
	// drop this cast and read getTournament?.qualificationSignInLockHours directly.
	const signInLockHours =
		(getTournament as unknown as { qualificationSignInLockHours?: number })
			?.qualificationSignInLockHours ?? 1;

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Qualification rooms"
				subtitle="Schedule rooms, assign rosters and referees."
				actions={
					<>
						<ExportQualificationRoomsButton tournamentAbbreviation={tournamentAbbreviation} />
						<QualificationRoomModal
							tournamentAbb={tournamentAbbreviation}
							modalType={{
								type: "add",
							}}
						/>
					</>
				}
			/>

			<SignInLockSetting
				tournamentAbbreviation={tournamentAbbreviation}
				currentHours={signInLockHours}
			/>

			{canSignIn && (
				<Card className="py-3">
					{myRooms.length > 0 ? (
						<p className="text-sm">
							<span className="text-white/50">You are refereeing: </span>
							<span className="font-semibold text-mintGreen">
								{myRooms
									.map(
										(room) =>
											`Room #${room.number} (${format(new Date(room.startDate), "dd/MM/yyyy HH:mm")})`,
									)
									.join(", ")}
							</span>
						</p>
					) : (
						<p className="text-sm text-white/50">
							You are not assigned to any qualification room yet.
						</p>
					)}
				</Card>
			)}

			<Card className="p-0">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Number</th>
								<th>Start date time (UTC+0)</th>
								<th>Roster</th>
								<th>Referee</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{rooms.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-8 text-center text-white/40">
										No qualification rooms yet.
									</td>
								</tr>
							) : (
								rooms.map((room) => (
									<tr key={room.id}>
										<td>{room.number}</td>
										<td>{format(new Date(room.startDate), "dd/MM/yyyy HH:mm")}</td>
										<td>
											{room.tournamentType === tournamentType.PARTICIPANT_VS ? (
												<details className="text-sm">
													<summary className="cursor-pointer text-white/70">
														{(room as ParticipantBasedQualificationRoom).participants?.length ?? 0} players
													</summary>
													<div className="mt-2 flex flex-col gap-1">
														{(room as ParticipantBasedQualificationRoom).participants?.map((participant) => (
															<span key={participant.id} className="truncate">
																{participant.user.username}
															</span>
														))}
													</div>
												</details>
											) : (
												<details className="text-sm">
													<summary className="cursor-pointer text-white/70">
														{(room as TeamBasedQualificationRoom).teams?.length ?? 0} teams
													</summary>
													<div className="mt-2 flex flex-col gap-1">
														{(room as TeamBasedQualificationRoom).teams?.map((team) => (
															<div key={team.id} className="flex items-center gap-2 truncate">
																<Image src={team.logoUrl || "/aim_logo.svg"} alt={team.name} width={18} height={18} />
																{team.name}
															</div>
														))}
													</div>
												</details>
											)}
										</td>
										<td>
											{room.staffMember ? (
												<div className="flex items-center gap-2">
													<div className="avatar">
														<div className="mask mask-squircle h-6 w-6">
															<Image
																src={`https://a.ppy.sh/${room.staffMember.user?.osuId}`}
																alt={room.staffMember.user?.username || "Referee"}
																width={24}
																height={24}
															/>
														</div>
													</div>
													<span className="truncate">{room.staffMember.user?.username}</span>
													{userData?.id === room.staffMember.user?.id && (
														<RefereeSignButton
															tournamentAbbreviation={tournamentAbbreviation}
															roomId={room.id}
															signIn={false}
														/>
													)}
												</div>
											) : canSignIn ? (
												<RefereeSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													roomId={room.id}
													signIn={true}
												/>
											) : (
												<span className="text-white/40">-</span>
											)}
										</td>
										<td>
											<div className="flex items-center gap-1">
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
																		).participants?.map((participant) => ({
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
												<DeleteRoomButton
													tournamentAbbreviation={tournamentAbbreviation}
													roomId={room.id}
													roomNumber={room.number}
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

export default QRoomsPage;

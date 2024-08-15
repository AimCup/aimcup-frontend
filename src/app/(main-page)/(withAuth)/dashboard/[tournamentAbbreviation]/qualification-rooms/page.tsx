import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
	AdminQualificationService,
	AdminStaffMemberService,
	type ParticipantResponseDto,
	ParticipantService,
	type QualificationRoomResponseDto,
	QualificationService,
	type StaffMemberResponseDto,
	type TeamResponseDto,
	TeamService,
	TournamentRequestDto,
	TournamentService,
	UserService,
} from "../../../../../../../generated";
import { QualificationRoomModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/qualification-rooms/QualificationRoomModal";
import { executeFetch } from "@/lib/executeFetch";
import { type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { getUser } from "@/actions/public/getUserAction";

interface QualificationRoom extends QualificationRoomResponseDto {
	id: string;
	number: number;
	isClosed: number;
	maxSlots: number;
	occupiedSlots: number;
	staffMember: StaffMemberResponseDto;
	startDate: string;
}

interface TeamBasedQualificationRoom extends QualificationRoom {
	teams: TeamResponseDto[];
}

interface ParticipantBasedQualificationRoom extends QualificationRoom {
	participants: ParticipantResponseDto[];
}

const qualificationRooms = (
	rooms: QualificationRoomResponseDto[],
): (TeamBasedQualificationRoom | ParticipantBasedQualificationRoom)[] => {
	return rooms.map((room) => {
		if (room.tournamentType !== TournamentRequestDto.tournamentType.PARTICIPANT_VS) {
			return room as TeamBasedQualificationRoom;
		} else {
			return room as ParticipantBasedQualificationRoom;
		}
	});
};

const QRoomsPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	const userData = await getUser();
	const getStaffForATournamentUser = await executeFetch(
		UserService.getTournamentStaffMember(tournamentAbbreviation),
	);

	const getQualificationRooms = await executeFetch(
		QualificationService.getQualificationRooms(tournamentAbbreviation),
	);
	const getStaffMembers = await executeFetch(
		AdminStaffMemberService.getStaffMembers1(tournamentAbbreviation),
	);

	const getTournament = await executeFetch(
		TournamentService.getTournamentByAbbreviation(tournamentAbbreviation),
	);

	if (!getStaffForATournamentUser.status) {
		return <div>{getStaffForATournamentUser.errorMessage}</div>;
	}

	if (!getStaffMembers.status) {
		return <div>{getStaffMembers.errorMessage}</div>;
	}

	if (!getQualificationRooms.status) {
		return <div>{getQualificationRooms.errorMessage}</div>;
	}

	if (!getTournament.status) {
		return <div>{getTournament.errorMessage}</div>;
	}

	const staffMemberSelectOptions: selectOptions[] = getStaffMembers.response
		.filter((s) => s.user)
		.map((staffMember) => ({
			id: staffMember.id,
			label: staffMember.user ? staffMember.user.username : staffMember.username || "",
		}));

	let rostersSelectOptions: selectOptions[] = [];
	if (
		getTournament.response.tournamentType !== TournamentRequestDto.tournamentType.PARTICIPANT_VS
	) {
		const getTeams = await executeFetch(
			TeamService.getTeamsByTournament(tournamentAbbreviation),
		);
		if (!getTeams.status) {
			return <div>{getTeams.errorMessage}</div>;
		}
		rostersSelectOptions = getTeams.response.map((team) => ({
			id: team.id,
			label: team.name,
		}));
	} else {
		const getParticipants = await executeFetch(
			ParticipantService.getParticipants(tournamentAbbreviation),
		);
		if (!getParticipants.status) {
			return <div>{getParticipants.errorMessage}</div>;
		}
		rostersSelectOptions = getParticipants.response.map((participant) => ({
			id: participant.id,
			label: participant.user.username,
		}));
	}

	const canSignIn =
		getStaffForATournamentUser.response.roles?.some((role) =>
			role.permissions.some(
				(permission) => permission === "QUALIFICATION_ROOM_STAFF_MEMBER_SIGN_IN",
			),
		) ||
		getStaffForATournamentUser.response.permissions?.some(
			(permission) => permission === "QUALIFICATION_ROOM_STAFF_MEMBER_SIGN_IN",
		);

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			{`
               brakujue sign out :) 
            `}
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
						{qualificationRooms(getQualificationRooms.response).map((room) => (
							<tr key={room.id}>
								<td>{room.number}</td>
								<td>{format(new Date(room.startDate), "dd/MM/yyyy hh:mm")}</td>
								<td>
									{room.tournamentType ===
									TournamentRequestDto.tournamentType.PARTICIPANT_VS
										? (
												room as ParticipantBasedQualificationRoom
											).participants.map((participant) => (
												<div key={participant.id}>
													{participant.user.username}
												</div>
											))
										: (room as TeamBasedQualificationRoom).teams.map((team) => (
												<div key={team.id}>
													{team.name}
													<Image
														src={team.logoUrl}
														alt={team.name}
														width={50}
														height={50}
													/>
												</div>
											))}
								</td>
								<td>
									{room.staffMember ? (
										userData?.id === room.staffMember.user?.id ? (
											<div>Sign out:todo</div>
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
												await executeFetch(
													AdminQualificationService.signInQualificationRoom(
														tournamentAbbreviation,
														room.id,
													),
													[
														"/",
														"/dashboard/[tournamentAbb]/qualification-rooms",
													],
												);
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
													TournamentRequestDto.tournamentType
														.PARTICIPANT_VS
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
											await executeFetch(
												AdminQualificationService.deleteQualificationRoom(
													tournamentAbbreviation,
													room.id,
												),
												[
													"/",
													"/dashboard/[tournamentAbb]/qualification-rooms",
												],
											);
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

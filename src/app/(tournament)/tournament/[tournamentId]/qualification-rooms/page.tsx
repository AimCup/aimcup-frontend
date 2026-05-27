import React from "react";
import { cookies } from "next/headers";
import { format } from "date-fns";
import Image from "next/image";
import {
	client,
	getParticipants,
	getQualificationRooms,
	getTeamsByTournament,
	getTournamentByAbbreviation,
	type QualificationRoomResponseDto,
	signInQualificationRoomAsCaptain,
	tournamentType,
} from "../../../../../../client";
import { getUser } from "@/actions/public/getUserAction";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import Section from "@ui/atoms/Section/Section";
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

const QualificationRoomsPage = async ({
	params: { tournamentId },
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});
	const userData = await getUser();

	const [
		{ data: getQualificationRoomsData },
		{ data: getTeamFromTournamentData },
		{ data: tournamentData },
		{ data: participantsData },
	] = await Promise.all([
		getQualificationRooms({ path: { abbreviation: tournamentId } }),
		getTeamsByTournament({ path: { abbreviation: tournamentId } }),
		getTournamentByAbbreviation({ path: { abbreviation: tournamentId } }),
		getParticipants({ path: { abbreviation: tournamentId } }),
	]);

	const isAuction = tournamentData?.tournamentType === tournamentType.AUCTION;

	const isUserCaptain = getTeamFromTournamentData?.some(
		(team) => team.captain?.user.id === userData?.id,
	);

	const currentParticipant = participantsData?.find(
		(p) => p.user.id === userData?.id,
	);
	const isRegisteredParticipant = !!currentParticipant;

	const showActions = isAuction ? isRegisteredParticipant : isUserCaptain;

	const isParticipantSignedIn = (
		room: TeamBasedQualificationRoom | ParticipantBasedQualificationRoom,
	) => {
		if (isAuction) {
			return (room as ParticipantBasedQualificationRoom).participants?.some(
				(p) => p.user.id === userData?.id,
			);
		}
		return (
			room.tournamentType !== tournamentType.PARTICIPANT_VS &&
			(room as TeamBasedQualificationRoom).teams?.some((team) =>
				team.participants.some((participant) => participant.id === userData?.id),
			)
		);
	};

	return (
		<Section id="qualifocation-rooms" className={"flex-col"}>
			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Qualification rooms</h2>

				<div className="mt-3 overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Start date time (UTC+0)</th>
								<th>Roster</th>
								<th>Referee</th>
								{showActions && <th>Actions</th>}
							</tr>
						</thead>
						<tbody>
							{qualificationRooms(getQualificationRoomsData || []).map((room) => (
								<tr key={room.id}>
									<td>{format(new Date(room.startDate), "dd/MM/yyyy HH:mm")}</td>
									<td className={"flex flex-col gap-2"}>
										{isAuction || room.tournamentType === tournamentType.PARTICIPANT_VS
											? (room as ParticipantBasedQualificationRoom).participants?.map(
												(participant) => (
													<div key={participant.id}>
														{participant.user.username}
													</div>
												),
											)
											: (room as TeamBasedQualificationRoom).teams?.map((team) => (
												<div key={team.id} className={"flex gap-2 truncate"}>
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
										) : (
											"-"
										)}
									</td>
									{showActions && (
										<td>
											{!isParticipantSignedIn(room) ? (
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														client.setConfig({
															baseUrl: process.env.NEXT_PUBLIC_API_URL,
															headers: { Cookie: `token=${cookie}` },
														});
														await signInQualificationRoomAsCaptain({
															path: {
																abbreviation: tournamentId,
																roomId: room.id,
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentId}/qualification-rooms`,
															`/tournament/${tournamentId}/qualification-rooms`,
														]);
													}}
												>
													<button className="btn btn-ghost btn-xs" type={"submit"}>
														Sign in
													</button>
												</form>
											) : (
												"-"
											)}
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Section>
	);
};

export default QualificationRoomsPage;

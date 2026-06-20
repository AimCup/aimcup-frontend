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

	const rooms = qualificationRooms(getQualificationRoomsData || []);
	const myRooms = rooms.filter((room) => isParticipantSignedIn(room));

	return (
		<Section id="qualifocation-rooms" className={"flex-col"}>
			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Qualification rooms</h2>
					{showActions && (
						<div className="mb-3 rounded-xl border border-white/[0.06] bg-tuned p-3 text-sm">
							{myRooms.length > 0 ? (
								<span>
									<span className="text-white/50">You are signed into: </span>
									<span className="font-semibold text-mintGreen">
										{myRooms
											.map(
												(r) =>
													`Room #${r.number} (${format(new Date(r.startDate), "dd/MM/yyyy HH:mm")})`,
											)
											.join(", ")}
									</span>
								</span>
							) : (
								<span className="text-white/50">You are not signed into a qualification room yet.</span>
							)}
						</div>
					)}

				<div className="mt-3 overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Number</th>
								<th>Start date time (UTC+0)</th>
								<th>Roster</th>
								<th>Referee</th>
								{showActions && <th>Actions</th>}
							</tr>
						</thead>
						<tbody>
								{rooms.map((room) => (
								<tr key={room.id}>
									<td>{room.number}</td>
									<td>{format(new Date(room.startDate), "dd/MM/yyyy HH:mm")}</td>
									<td>
										{isAuction || room.tournamentType === tournamentType.PARTICIPANT_VS ? (
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
											{isParticipantSignedIn(room) ? (
												"-"
											) : room.isClosed ? (
												<div className="flex flex-col gap-1">
													<button className="btn btn-ghost btn-xs" type={"button"} disabled>
														Sign in
													</button>
													<span className="text-xs text-white/40">
														Sign-in time has passed
													</span>
												</div>
											) : (
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

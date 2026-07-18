import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { cookies } from "next/headers";
import {
	client,
	getMatches,
	getParticipants,
	getStaffMembers1,
	getTeamsByTournament,
	getTournamentByAbbreviation,
	getTournamentStaffMember,
	type MatchResultDto,
	type StaffMemberResponseDto,
	tournamentType,
} from "../../../../../../../client";
import { MatchResultModal } from "./MatchResultModal";
import { RevertResultButton } from "./RevertResultButton";
import ExportScheduleButton from "./ExportScheduleButton";
import { type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { getUser } from "@/actions/public/getUserAction";
import { MatchesModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/MatchesModal";
import { EditMatchModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/EditMatchModal";
import {
	StaffSignButton,
	DeleteMatchButton,
} from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/MatchRowActions";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const MatchesPage = async ({
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

	// Fetch all independent data in parallel
	const [
		userData,
		{ data: getStaffForATournamentUser },
		{ data: getStaffMembers },
		{ data: getTournament },
		{ data },
	] = await Promise.all([
		getUser(),
		getTournamentStaffMember({ path: { abbreviation: tournamentAbbreviation } }),
		getStaffMembers1({ path: { abbreviation: tournamentAbbreviation } }),
		getTournamentByAbbreviation({ path: { abbreviation: tournamentAbbreviation } }),
		getMatches({ path: { abbreviation: tournamentAbbreviation } }),
	]);

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
		getStaffForATournamentUser?.permissions?.some((permission) => {
			const b = permission === "MATCH_STAFF_MEMBER_SIGN_IN";
			return b;
		}) ||
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some((permission) => permission === "MATCH_STAFF_MEMBER_SIGN_IN"),
		);

	// Host-level access. Co-Host is intentionally treated the same as Host: it ships with
	// identical permissions, so it must not be locked out of match/result management.
	const isHost =
		getStaffForATournamentUser?.roles?.some(
			(role) => role.name === "Host" || role.name === "Co-Host",
		) || false;

	const isDeveloper =
		getStaffForATournamentUser?.roles?.some((role) => role.name === "Developer") || false;

	// A staff member counts as a referee of a match when their user is among the match's referees.
	const isRefereeOfMatch = (referees: StaffMemberResponseDto[] | undefined) =>
		referees?.some((referee) => referee.user?.id === userData?.id) ?? false;

	const REFEREE_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;
	// createdAt is exposed by the result DTO (added server-side); cast until the generated client is regenerated.
	const withinRefereeEditWindow = (matchResult: MatchResultDto | null | undefined) => {
		const createdAt = (matchResult as { createdAt?: string } | null | undefined)?.createdAt;
		// Mirror the backend: an unknown createdAt is treated as outside the window (referee edit denied).
		return !!createdAt && Date.now() - new Date(createdAt).getTime() < REFEREE_EDIT_WINDOW_MS;
	};

	// Add a result: assigned referee, Host/Co-Host or Developer.
	const canAddResult = (referees: StaffMemberResponseDto[] | undefined) =>
		isHost || isDeveloper || isRefereeOfMatch(referees);

	// Edit an existing result: Host/Co-Host/Developer any time; the referee only within 24h of first entry.
	const canEditResult = (
		referees: StaffMemberResponseDto[] | undefined,
		matchResult: MatchResultDto | null | undefined,
	) =>
		isHost ||
		isDeveloper ||
		(isRefereeOfMatch(referees) && withinRefereeEditWindow(matchResult));

	const showSignOut = (staffMembers: StaffMemberResponseDto[] | undefined) => {
		return (
			staffMembers?.some((staffMember) => {
				return staffMember.user?.id === userData?.id;
			}) && canSignIn
		);
	};

	const showSignIn = (staffMembers: StaffMemberResponseDto[] | undefined) => {
		return (
			canSignIn &&
			!staffMembers?.some((staffMember) => {
				return staffMember.user?.id === userData?.id;
			})
		);
	};

	const unfinishedMatches =
		data
			?.filter((match) => match.matchResult === null)
			?.sort((a, b) => (a.startDate > b.startDate ? 1 : -1)) ?? [];

	const finishedMatches =
		data
			?.filter((match) => match.matchResult !== null)
			?.sort((a, b) => (a.startDate > b.startDate ? 1 : -1)) ?? [];

	const showUpcomingActions =
		isHost || isDeveloper || unfinishedMatches.some((match) => isRefereeOfMatch(match.referees));

	const showFinishedActions =
		isHost || isDeveloper || finishedMatches.some((match) => isRefereeOfMatch(match.referees));

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Matches"
				subtitle="Schedule matches, manage staff sign-in/out and results."
				actions={
					<div className="flex items-center gap-2">
						<ExportScheduleButton tournamentAbbreviation={tournamentAbbreviation} />
						<MatchesModal
							tournamentAbb={tournamentAbbreviation}
							modalType={{ type: "add" }}
							teams={rostersSelectOptions}
							staffMembers={staffMemberSelectOptions}
						/>
					</div>
				}
			/>

			{/* Unfinished matches */}
			<Card className="p-0">
				<div className="px-5 py-4 sm:px-6">
					<h2 className="text-lg font-bold text-white">Upcoming matches</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Match ID</th>
								<th>Start date (UTC+0)</th>
								<th>Stage</th>
								<th>Team blue</th>
								<th>Team red</th>
								<th>Referee</th>
								<th>Commentators</th>
								<th>Streamers</th>
								{showUpcomingActions && <th>Actions</th>}
							</tr>
						</thead>
						<tbody>
							{unfinishedMatches.length === 0 ? (
								<tr>
									<td
										colSpan={showUpcomingActions ? 9 : 8}
										className="py-8 text-center text-white/40"
									>
										No upcoming matches yet.
									</td>
								</tr>
							) : (
								unfinishedMatches.map((match) => (
									<tr key={match.id}>
										<td>{match.matchId}</td>
										<td>
											{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}
										</td>
										<td>{match.stage?.stageType}</td>
										<td>{match.teamBlue.name}</td>
										<td>{match.teamRed.name}</td>

										{/* Referee column */}
										<td>
											<div className="flex flex-col gap-2">
												{match.referees?.map((referee) => (
													<div key={referee.id} className="flex gap-2">
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${referee.user?.osuId}`}
																	alt="referee"
																	width={20}
																	height={20}
																/>
															</div>
														</div>
														{referee?.user?.username}
													</div>
												))}
											</div>
											{showSignOut(match.referees) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={false}
													type="REFEREE"
												/>
											)}
											{showSignIn(match.referees) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={true}
													type="REFEREE"
												/>
											)}
										</td>

										{/* Commentators column */}
										<td>
											<div className="flex flex-col gap-2">
												{match.commentators?.map((com) => (
													<div key={com.id} className="flex gap-2">
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${com.user?.osuId}`}
																	alt="commentator"
																	width={20}
																	height={20}
																/>
															</div>
														</div>
														{com?.user?.username}
													</div>
												))}
											</div>
											{showSignOut(match.commentators) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={false}
													type="COMMENTATOR"
												/>
											)}
											{showSignIn(match.commentators) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={true}
													type="COMMENTATOR"
												/>
											)}
										</td>

										{/* Streamers column */}
										<td>
											<div className="flex flex-col gap-2">
												{match.streamers?.map((str) => (
													<div key={str.id} className="flex gap-2">
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${str.user?.osuId}`}
																	alt="streamer"
																	width={20}
																	height={20}
																/>
															</div>
														</div>
														{str?.user?.username}
													</div>
												))}
											</div>
											{showSignOut(match.streamers) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={false}
													type="STREAMER"
												/>
											)}
											{showSignIn(match.streamers) && (
												<StaffSignButton
													tournamentAbbreviation={tournamentAbbreviation}
													matchId={match.id}
													signIn={true}
													type="STREAMER"
												/>
											)}
										</td>

										{showUpcomingActions && (
											<td>
												<div className="flex items-center gap-1">
													{canAddResult(match.referees) && (
														<MatchResultModal
															tournamentAbbreviation={tournamentAbbreviation}
															match={match}
															mode="add"
														/>
													)}
													{isHost && (
														<>
															<EditMatchModal
																tournamentAbb={tournamentAbbreviation}
																modalType={{
																	match: match,
																	staffMembers: staffMemberSelectOptions,
																}}
															/>
															<DeleteMatchButton
																tournamentAbbreviation={tournamentAbbreviation}
																matchId={match.id}
																matchLabel={match.matchId}
															/>
														</>
													)}
												</div>
											</td>
										)}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>

			{/* Finished matches */}
			<Card className="p-0">
				<div className="px-5 py-4 sm:px-6">
					<h2 className="text-lg font-bold text-white">Finished matches</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Start date (UTC+0)</th>
								<th>Stage</th>
								<th>Team blue</th>
								<th>Team red</th>
								<th>Referee</th>
								<th>Commentators</th>
								<th>Streamers</th>
								{showFinishedActions && <th>Actions</th>}
							</tr>
						</thead>
						<tbody>
							{finishedMatches.length === 0 ? (
								<tr>
									<td
										colSpan={showFinishedActions ? 8 : 7}
										className="py-8 text-center text-white/40"
									>
										No finished matches yet.
									</td>
								</tr>
							) : (
								finishedMatches.map((match) => (
									<tr key={match.id}>
										<td>
											{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}
										</td>
										<td>{match.stage?.stageType}</td>
										<td>{match.teamBlue.name}</td>
										<td>{match.teamRed.name}</td>
										<td>
											{match.referees?.map((referee) => (
												<div key={referee?.user?.id}>
													{referee?.user?.username}
												</div>
											))}
										</td>
										<td>
											{match.commentators?.map((commentator) => (
												<div key={commentator?.user?.id}>
													{commentator.user?.username}
												</div>
											))}
										</td>
										<td>
											{match.streamers?.map((streamer) => (
												<div key={streamer?.user?.id}>
													{streamer?.user?.username}
												</div>
											))}
										</td>
										{showFinishedActions && (
											<td>
												<div className="flex items-center gap-1">
													{canEditResult(match.referees, match.matchResult) && (
														<MatchResultModal
															tournamentAbbreviation={tournamentAbbreviation}
															match={match}
															mode="edit"
														/>
													)}
													{(isHost || isDeveloper) && (
														<RevertResultButton
															tournamentAbbreviation={tournamentAbbreviation}
															matchId={match.id}
														/>
													)}
												</div>
											</td>
										)}
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

export default MatchesPage;

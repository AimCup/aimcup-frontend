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
	signInMatchStaffMember,
	type StaffMemberResponseDto,
	tournamentType,
} from "../../../../../../../client";
import { type selectOptions } from "@ui/atoms/Forms/Select/ComboBox";
import { getUser } from "@/actions/public/getUserAction";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";
import { MatchesModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/MatchesModal";

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
	const userData = await getUser();
	const { data: getStaffForATournamentUser } = await getTournamentStaffMember({
		path: {
			abbreviation: tournamentAbbreviation,
		},
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

	const { data } = await getMatches({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const canSignIn =
		getStaffForATournamentUser?.permissions?.some((permission) => {
			const b = permission === "MATCH_STAFF_MEMBER_SIGN_IN";
			return b;
		}) ||
		getStaffForATournamentUser?.roles?.some((role) =>
			role.permissions.some((permission) => permission === "MATCH_STAFF_MEMBER_SIGN_IN"),
		);

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

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Matches</h2>
			<MatchesModal
				tournamentAbb={tournamentAbbreviation}
				modalType={{
					type: "add",
				}}
				teams={rostersSelectOptions}
				staffMembers={staffMemberSelectOptions}
			/>

			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<div className="mt-3 overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Start date time (UTC+0)</th>
								<th>Stage</th>
								<th>Team blue</th>
								<th>Team red</th>
								<th>Referee</th>
								<th>Commentators</th>
								<th>Streamers</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{data
								?.filter((match) => match.matchResult === null)
								?.sort((a, b) => {
									return a.startDate > b.startDate ? 1 : -1;
								})
								.map((match) => (
									<tr key={match.id}>
										<td>
											{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}
										</td>
										<td>{match.stage?.stageType}</td>
										<td>{match.teamBlue.name}</td>
										<td>{match.teamRed.name}</td>
										<td>
											<div className={"flex flex-col gap-2"}>
												{match.referees?.map((referee) => (
													<div key={referee.id} className={"flex gap-2"}>
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
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: false,
																type: "REFEREE",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
														]);
													}}
												>
													<button
														className="btn btn-ghost btn-xs mt-2"
														type={"submit"}
													>
														sign out
													</button>
												</form>
											)}
											{showSignIn(match.referees) && (
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: true,
																type: "REFEREE",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
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
											)}
										</td>
										<td>
											<div className={"flex flex-col gap-2"}>
												{match.commentators?.map((com) => (
													<div key={com.id} className={"flex gap-2"}>
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${com.user?.osuId}`}
																	alt="referee"
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
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: false,
																type: "COMMENTATOR",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
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
											)}
											{showSignIn(match.commentators) && (
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: true,
																type: "COMMENTATOR",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
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
											)}
										</td>
										<td>
											<div className={"flex flex-col gap-2"}>
												{match.streamers?.map((str) => (
													<div key={str.id} className={"flex gap-2"}>
														<div className="avatar">
															<div className="mask mask-squircle h-5 w-5">
																<Image
																	src={`https://a.ppy.sh/${str.user?.osuId}`}
																	alt="referee"
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
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: false,
																type: "STREAMER",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
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
											)}
											{showSignIn(match.streamers) && (
												<form
													action={async (_e) => {
														"use server";
														const cookie = cookies().get("JWT")?.value;
														// configure internal service client
														client.setConfig({
															// set default base url for requests
															baseUrl:
																process.env.NEXT_PUBLIC_API_URL,
															// set default headers for requests
															headers: {
																Cookie: `token=${cookie}`,
															},
														});
														await signInMatchStaffMember({
															path: {
																abbreviation:
																	tournamentAbbreviation,
																matchId: match.id,
															},
															query: {
																in: true,
																type: "STREAMER",
															},
														});
														await multipleRevalidatePaths([
															"/",
															`/dashboard/${tournamentAbbreviation}/qualification-rooms`,
															`/tournament/${tournamentAbbreviation}/schedule`,
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
											)}
										</td>
										<td>(edit)</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>

			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Finished matches</h2>

				<div className="mt-3 overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Start date time (UTC+0)</th>
								<th>Stage</th>
								<th>Team blue</th>
								<th>Team red</th>
								<th>Referee</th>
								<th>Commentators</th>
								<th>Streamers</th>
							</tr>
						</thead>
						<tbody>
							{data
								?.filter((match) => match.matchResult !== null)
								?.sort((a, b) => {
									return a.startDate > b.startDate ? 1 : -1;
								})
								.map((match) => (
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
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default MatchesPage;

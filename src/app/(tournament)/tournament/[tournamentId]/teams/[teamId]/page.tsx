import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
	client,
	deleteParticipantFromTeam,
	disbandTeam,
	getTeamsById,
} from "../../../../../../../client";
import Section from "@ui/atoms/Section/Section";
import { Button } from "@ui/atoms/Button/Button";
import { getUser } from "@/actions/public/getUserAction";
import { ChangeTeamNameForm } from "@/app/(tournament)/tournament/[tournamentId]/teams/[teamId]/ChangeTeamNameForm";
import { InvitePlayerToTeamButton } from "@/app/(tournament)/tournament/[tournamentId]/teams/[teamId]/InvitePlayerToTeamButton";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

const TeamPage = async ({
	params: { tournamentId, teamId },
}: {
	params: { tournamentId: string; teamId: string };
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
	const { data: getTeam } = await getTeamsById({
		path: {
			abbreviation: tournamentId,
			teamId: teamId,
		},
	});

	const isCaptain = getTeam?.captain.user.id === userData?.id;

	return (
		<Section className={"flex-col"}>
			<div className={"mb-10 flex"}>
				<div className={"flex gap-4 md:flex-row md:items-center"}>
					<div className="avatar">
						<div className="mask mask-squircle h-24 w-24">
							<img
								src={getTeam?.logoUrl || "/aim_logo.svg"}
								alt="team logo"
								width={100}
								height={100}
							/>
						</div>
					</div>

					<div>
						<h2 className={"text-4xl font-bold"}>{getTeam?.name}</h2>
						<p>Status: {getTeam?.status}</p>
					</div>
					{isCaptain && (
						<form
							className={"flex flex-col gap-4 md:flex-row md:items-center"}
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
								const { data: disbandTeamResponse } = await disbandTeam({
									path: {
										abbreviation: tournamentId,
										teamId,
									},
								});

								await multipleRevalidatePaths([
									`/tournament/${tournamentId}/teams`,
									`/tournament/${tournamentId}`,
									"/",
								]);
								if (disbandTeamResponse) {
									redirect(`/tournament/${tournamentId}/teams`);
								}
							}}
						>
							<Button type={"submit"}>Disband team</Button>
						</form>
					)}
				</div>
			</div>
			{isCaptain && (
				<>
					<div className={"mb-2"}>
						<p>
							Once you finish adding your team roster and setting team image, ping
							Host of the tournament to change your team status to ACCEPTED. Any
							changes in the team will change its status to PENDING.
						</p>
					</div>
					<div className={"mb-10 flex"}>
						<ChangeTeamNameForm
							team={{
								teamId: getTeam?.id || "",
								teamName: getTeam?.name || "",
								logoUrl: getTeam?.logoUrl || "",
								tournamentAbbreviation: tournamentId,
							}}
						/>
					</div>
					<div className={"mb-10 flex"}>
						<InvitePlayerToTeamButton
							team={{
								teamId: getTeam?.id || "",
								tournamentAbbreviation: tournamentId,
							}}
						/>
					</div>
				</>
			)}
			<div className={"my-2"}>
				<strong>Captain discord: </strong>
				{getTeam?.captain?.user?.discordUsername}
			</div>
			<strong>Team Members:</strong>
			<div className="overflow-x-auto">
				<table className="table">
					{/* head */}
					<thead>
						<tr>
							<th>Username</th>
							{isCaptain && <th>actions</th>}
						</tr>
					</thead>
					<tbody>
						{getTeam?.participants.map((participant) => (
							<tr key={participant.id}>
								<td>
									<div className="flex items-center gap-3">
										<div className="avatar">
											<div className="mask mask-squircle h-12 w-12">
												<Image
													src={`https://a.ppy.sh/${participant.user.osuId}`}
													alt="Avatar Tailwind CSS Component"
													width={100}
													height={100}
												/>
											</div>
										</div>
										<div>
											<div className="font-bold">
												{participant.user.username}
											</div>
										</div>
									</div>
								</td>
								{isCaptain && (
									<th>
										{participant.user.id !== userData?.id && ( // if not captain
											<form
												className={
													"flex flex-col gap-4 md:flex-row md:items-center"
												}
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
													await deleteParticipantFromTeam({
														path: {
															teamId: getTeam?.id || "",
															participantId: "" + participant.id,
															abbreviation: tournamentId,
														},
													});

													await multipleRevalidatePaths([
														`/tournament/${tournamentId}/teams`,
														`/tournament/${tournamentId}`,
														"/",
													]);
												}}
											>
												<button
													className={"btn btn-ghost btn-xs"}
													type={"submit"}
												>
													delete
												</button>
											</form>
										)}
									</th>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Section>
	);
};

export default TeamPage;

import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { TeamService } from "../../../../../../../generated";
import Section from "@ui/atoms/Section/Section";
import { Button } from "@ui/atoms/Button/Button";
import { executeFetch } from "@/lib/executeFetch";
import { getUser } from "@/actions/public/getUserAction";
import { ChangeTeamNameForm } from "@/app/(tournament)/tournament/[tournamentId]/teams/[teamId]/ChangeTeamNameForm";
import { InvitePlayerToTeamButton } from "@/app/(tournament)/tournament/[tournamentId]/teams/[teamId]/InvitePlayerToTeamButton";

const TeamPage = async ({
	params: { tournamentId, teamId },
}: {
	params: { tournamentId: string; teamId: string };
}) => {
	const userData = await getUser();
	const getTeam = await executeFetch(TeamService.getTeamsById(tournamentId, teamId));

	if (!getTeam.status) {
		return <Section>{getTeam.errorMessage}</Section>;
	}

	const isCaptain = getTeam.response.captain.user.id === userData?.id;

	return (
		<Section className={"flex-col"}>
			<div className={"mb-10 flex"}>
				<div className={"flex gap-4 md:flex-row md:items-center"}>
					{getTeam.response.logoUrl && (
						<div className="avatar">
							<div className="mask mask-squircle h-24 w-24">
								<img
									src={getTeam.response.logoUrl}
									alt="team logo"
									width={100}
									height={100}
								/>
							</div>
						</div>
					)}
					<h2 className={"text-4xl font-bold"}>{getTeam.response.name}</h2>
					{isCaptain && (
						<form
							className={"flex flex-col gap-4 md:flex-row md:items-center"}
							action={async (_e) => {
								"use server";

								const disbandTeamResponse = await executeFetch(
									TeamService.disbandTeam(tournamentId, teamId),
									[
										`/tournament/${tournamentId}/teams`,
										`/tournament/${tournamentId}`,
										"/",
									],
								);

								if (disbandTeamResponse.status) {
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
					<div className={"mb-10 flex"}>
						<ChangeTeamNameForm
							team={{
								teamId: getTeam.response.id,
								teamName: getTeam.response.name,
								logoUrl: getTeam.response.logoUrl,
								tournamentAbbreviation: tournamentId,
							}}
						/>
					</div>
					<div className={"mb-10 flex"}>
						<InvitePlayerToTeamButton
							team={{
								teamId: getTeam.response.id,
								tournamentAbbreviation: tournamentId,
							}}
						/>
					</div>
				</>
			)}

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
						{getTeam.response.participants.map((participant) => (
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

													await executeFetch(
														TeamService.deleteParticipantFromTeam(
															tournamentId,
															teamId,
															"" + participant.user.osuId,
														),
														[
															"/tournament/[tournamentId]/teams",
															"/tournament",
															"/",
														],
													);
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

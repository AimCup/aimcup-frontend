import React from "react";
import Image from "next/image";
import { AdminTeamService } from "../../../../../../../generated";
import { executeFetch } from "@/lib/executeFetch";

const TeamsPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	const teams = await executeFetch(AdminTeamService.getTeams(tournamentAbbreviation));
	if (!teams.status) {
		return <div>Failed to fetch teams</div>;
	}
	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Teams</h2>
			<div className="mt-10 overflow-x-auto">
				<table className="table w-full">
					{/* head */}
					<thead>
						<tr>
							<th>Team name</th>
							<th>Captain</th>
							<th>Roster</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{teams.response.map((team) => {
							return (
								<tr key={team.id}>
									<td>
										<div className={"flex items-center gap-2"}>
											<div className="avatar">
												<div className="mask mask-squircle h-12 w-12">
													<Image
														src={team.logoUrl || ""}
														alt="Team logo"
														width={48}
														height={48}
													/>
												</div>
											</div>
											{team.name}
										</div>
									</td>
									<td>
										<div className={"flex items-center gap-2"}>
											<div className="avatar">
												<div className="mask mask-squircle h-12 w-12">
													<Image
														src={`https://a.ppy.sh/${team.captain.user.osuId}`}
														alt={team.captain.user.username}
														width={50}
														height={50}
													/>
												</div>
											</div>
											{team.captain.user.username}
										</div>
									</td>
									<td>
										{team.participants.map((participant) => (
											<div key={participant.id} className={"flex flex-col"}>
												<div className={"mb-2 flex items-center gap-2"}>
													<div className="avatar">
														<div className="mask mask-squircle h-12 w-12">
															<Image
																src={`https://a.ppy.sh/${participant.user.osuId}`}
																alt={participant.user.username}
																width={50}
																height={50}
															/>
														</div>
													</div>
													{participant.user.username}
												</div>
											</div>
										))}
									</td>
									<td>{team.status}</td>
									<td>
										<form
											action={async (_e) => {
												"use server";
												await executeFetch(
													AdminTeamService.changeTeamStatus(
														tournamentAbbreviation,
														team.id,
														"ACCEPTED",
													),
													[
														"/",
														`/dashboard/${tournamentAbbreviation}/teams`,
														`/tournament/${tournamentAbbreviation}/teams/${team.id}`,
														`/account/`,
													],
												);
											}}
										>
											<button
												className="btn btn-ghost btn-xs"
												type={"submit"}
											>
												ACCEPT
											</button>
										</form>
										<form
											action={async (_e) => {
												"use server";
												await executeFetch(
													AdminTeamService.changeTeamStatus(
														tournamentAbbreviation,
														team.id,
														"REJECTED",
													),
													[
														"/",
														`/dashboard/${tournamentAbbreviation}/teams`,
														`/tournament/${tournamentAbbreviation}/teams/${team.id}`,
														`/account/`,
													],
												);
											}}
										>
											<button
												className="btn btn-ghost btn-xs"
												type={"submit"}
											>
												REJECT
											</button>
										</form>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TeamsPage;

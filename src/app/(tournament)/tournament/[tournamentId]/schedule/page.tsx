import React from "react";
import { cookies } from "next/headers";
import { format } from "date-fns";
import Link from "next/link";
import { client, getMatches } from "../../../../../../client";
import Section from "@ui/atoms/Section/Section";
import { getUser } from "@/actions/public/getUserAction";
import { RescheduleMatchModal } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/matches/RescheduleMatchModal";

const SingleTournamentSchedule = async ({
	params,
}: {
	params: {
		tournamentId: string;
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
	const { data } = await getMatches({
		path: {
			abbreviation: params.tournamentId,
		},
	});
	return (
		<Section id="schedule" className={"flex-col"}>
			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Match schedule</h2>

				<div className="mt-3 overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<td>Match ID</td>
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
										<td>{match.matchId}</td>
										<td>
											{format(new Date(match.startDate), "dd/MM/yyyy HH:mm")}
										</td>
										<td>{match.stage?.stageType}</td>
										<td>
											<Link
												href={`
													/tournament/${params.tournamentId}/teams/${match.teamBlue.id}
												`}
											>
												{match.teamBlue.name}
											</Link>
										</td>
										<td>
											<Link
												href={`
													/tournament/${params.tournamentId}/teams/${match.teamRed.id}
												`}
											>
												{match.teamRed.name}
											</Link>
										</td>
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
										<td>
											{(match.teamRed?.captain?.user?.id === userData?.id ||
												match.teamBlue?.captain?.user?.id === userData?.id) && (
												<RescheduleMatchModal
													tournamentAbb={params.tournamentId}
													matchId={match.id}
													currentMatchDate={new Date(match.startDate)
														.toISOString()
														.slice(0, 16)}
												/>
											)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</Section>
	);
};

export default SingleTournamentSchedule;

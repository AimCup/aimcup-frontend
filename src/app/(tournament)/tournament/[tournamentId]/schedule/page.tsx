import React from "react";
import { cookies } from "next/headers";
import { client, getMatches, type MatchResponseDto } from "../../../../../../client";
import { ScheduleTable } from "./ScheduleTable";
import Section from "@ui/atoms/Section/Section";
import { getUser } from "@/actions/public/getUserAction";

// The schedule must reflect admin edits/deletes immediately, so never serve it (or its match fetches)
// from a cached server render.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
	const [{ data }, finishedResult] = await Promise.all([
		getMatches({
			path: {
				abbreviation: params.tournamentId,
			},
		}),
		// Called via the low-level client because this endpoint is newer than the committed generated
		// client. `npm run regen` against a backend exposing it will produce a `getFinishedMatches` helper.
		client.get<MatchResponseDto[]>({
			url: "/tournaments/{abbreviation}/matches/finished",
			path: { abbreviation: params.tournamentId },
		}),
	]);
	return (
		<Section id="schedule" className={"flex-col"}>
			<div className={"flex w-full flex-col !px-3 !py-2"}>
				<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Match schedule</h2>

				<ScheduleTable
					matches={data ?? []}
					finishedMatches={finishedResult.data ?? []}
					tournamentId={params.tournamentId}
					currentUserId={userData?.id}
				/>
			</div>
		</Section>
	);
};

export default SingleTournamentSchedule;

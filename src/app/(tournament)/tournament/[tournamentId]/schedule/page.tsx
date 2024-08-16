import React from "react";
import { cookies } from "next/headers";
import { client, getStages } from "../../../../../../client";
import { ScheduleList } from "@ui/organisms/ScheduleList/ScheduleList";

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
	const { data } = await getStages({
		path: {
			abbreviation: params.tournamentId,
		},
	});
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="schedule"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Schedule</h2>
					</div>
				</div>
				<ScheduleList scheduleList={data || []} />
			</section>
		</main>
	);
};

export default SingleTournamentSchedule;

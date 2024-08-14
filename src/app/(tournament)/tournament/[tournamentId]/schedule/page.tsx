import React from "react";
import { StageService } from "../../../../../../generated";
import { ScheduleList } from "@ui/organisms/ScheduleList/ScheduleList";

const SingleTournamentSchedule = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const data = await StageService.getStages(params.tournamentId);
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
				<ScheduleList scheduleList={data} />
			</section>
		</main>
	);
};

export default SingleTournamentSchedule;

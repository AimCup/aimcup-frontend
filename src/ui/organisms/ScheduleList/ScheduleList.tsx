import React from "react";
import { format } from "date-fns";
import { type StageResponseDto } from "../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";

export const ScheduleList = ({ scheduleList }: { scheduleList: StageResponseDto[] }) => {
	const scheduleListContent = scheduleList
		// Stages that exist only to hold matches (e.g. Swiss rounds sharing another round's mappool)
		// are flagged off so the schedule isn't cluttered with a row per round.
		?.filter((stage) => stage.showInSchedule !== false)
		.sort((a, b) => {
			return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
		})
		.map((stage) => {
			return (
				<div className={"flex items-center justify-between gap-4"} key={stage.id}>
					<span className={"font-bold"}>{stageTypeEnumToString(stage.stageType)}</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>
						{format(new Date(stage.startDate), "dd/MM/yyyy")} -{" "}
						{format(new Date(stage.endDate), "dd/MM/yyyy")}
					</span>
				</div>
			);
		}) ?? <>No schedule</>;

	return scheduleListContent;
};

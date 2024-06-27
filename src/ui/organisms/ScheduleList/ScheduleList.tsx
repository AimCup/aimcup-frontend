import React from "react";
import { format } from "date-fns";
import { type StageResponseDto } from "../../../../generated";
import { stageTypeEnumToString } from "@/lib/helpers";

export const ScheduleList = ({ scheduleList }: { scheduleList: StageResponseDto[] }) => {
	const scheduleListContent = scheduleList?.map((stage) => {
		return (
			<div className={"flex items-center justify-between gap-4"} key={stage.id}>
				<span className={"font-bold"}>{stageTypeEnumToString(stage.stageType)}</span>
				<span
					className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
				/>
				<span>
					{format(new Date(stage.startDate), "MM/dd/yyyy")} -{" "}
					{format(new Date(stage.endDate), "MM/dd/yyyy")}
				</span>
			</div>
		);
	}) ?? <>No schedule</>;

	return scheduleListContent;
};

import React from "react";
import { format } from "date-fns";
import { MappoolResponseDto, StageResponseDto, type stageType } from "../../../../client";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";
import { stageTypeEnumToString } from "@/lib/helpers";

interface IMappoolStagesProps {
	stage: {
		id: string;
		stageEnum: StageResponseDto["stageType"];
		date?: { start?: string; end?: string };
	};
	mappool: MappoolResponseDto;
	tournamentAbbreviation: string;
}

export const MappoolStages = (props: IMappoolStagesProps) => {
	let firstImage = `/placeholder.png`;
	const findFirstBm = props.mappool.beatmapsModifications?.find((bm) => {
		return bm.beatmaps && bm.beatmaps.length > 0;
	});
	if (findFirstBm && findFirstBm.beatmaps && findFirstBm.beatmaps.length > 0) {
		firstImage = findFirstBm.beatmaps[0].cardCover || firstImage;
	}
	const { stage } = props;
	return (
		<TournamentCard
			key={stage.id}
			title={stageTypeEnumToString(stage.stageEnum as stageType)}
			date={{
				start: format(new Date(stage.date?.start || 0), "dd/MM/yyyy"),
				end: format(new Date(stage.date?.end || 0), "dd/MM/yyyy"),
			}}
			status={false}
			img={firstImage}
			url={`/tournament/${props.tournamentAbbreviation}/mappool/${stage.stageEnum}`}
		/>
	);
};

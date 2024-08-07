import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import { format } from "date-fns";
import type { StageResponseDto } from "../../../../generated";
import { Carousel } from "@ui/organisms/Carousel/Carousel";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";
import { stageTypeEnumToString } from "@/lib/helpers";

const OPTIONS: EmblaOptionsType = { loop: false };

interface IMappoolStagesProps {
	stage: {
		id: string;
		stageEnum: StageResponseDto["stageType"];
		date?: { start?: string; end?: string };
		shouldDisplay?: boolean;
	}[];
	tournamentAbbreviation: string;
}

export const MappoolStages = (props: IMappoolStagesProps) => {
	const stagesCards = props.stage
		.filter((stage) => stage.shouldDisplay)
		.map((stage) => {
			return (
				<TournamentCard
					key={stage.id}
					title={stageTypeEnumToString(stage.stageEnum)}
					date={{
						start: format(new Date(stage.date?.start || 0), "dd/MM/yyyy"),
						end: format(new Date(stage.date?.end || 0), "dd/MM/yyyy"),
					}}
					status={false}
					img={`/placeholder.png`}
					url={`/tournament/${props.tournamentAbbreviation}/mappool/${stage.stageEnum}`}
				/>
			);
		});

	return (
		<>
			<div className={"flex md:hidden"}>
				<Carousel slides={stagesCards} options={OPTIONS} />
			</div>
			<div className={"hidden flex-col gap-10 md:flex md:w-full"}>
				{stagesCards.map((slide) => slide)}
			</div>
		</>
	);
};

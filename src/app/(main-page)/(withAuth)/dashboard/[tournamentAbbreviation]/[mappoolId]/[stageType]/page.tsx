import React from "react";
import { MappoolService, type StageResponseDto } from "../../../../../../../../generated";
import Section from "@ui/atoms/Section/Section";
import { stageTypeEnumToString } from "@/lib/helpers";
import { AddBeatMap } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/[mappoolId]/[stageType]/AddBeatMap";

const MappoolStagePage = async ({
	params: { tournamentAbbreviation, stageType, mappoolId },
}: {
	params: {
		tournamentAbbreviation: string;
		stageType: StageResponseDto.stageType;
		mappoolId: string;
	};
}) => {
	let mappoolStage;
	try {
		mappoolStage = await MappoolService.getMappoolByStage(tournamentAbbreviation, stageType);
	} catch (error) {
		console.error(error);
	}

	console.log(mappoolStage);

	return (
		<>
			<Section className={"flex-col"}>
				<h1>{tournamentAbbreviation}</h1>
				<h2>{stageTypeEnumToString(stageType)}</h2>
				<AddBeatMap tournamentAbb={tournamentAbbreviation} mappoolId={mappoolId} />
			</Section>
		</>
	);
};

export default MappoolStagePage;

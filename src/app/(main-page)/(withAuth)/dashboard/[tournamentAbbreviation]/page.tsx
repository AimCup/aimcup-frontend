import React from "react";
import Section from "@ui/atoms/Section/Section";

const DashboardHome = async ({
	params,
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	// todo Promise.allSettled
	// const tournamentData = await TournamentService.getTournamentByAbbreviation(
	// 	params.tournamentAbbreviation,
	// );
	// const getStagesData = await StageService.getStages(params.tournamentAbbreviation);
	// //
	//
	// const stageWithoutMappool = [
	// 	StageResponseDto.stageType.REGISTRATION,
	// 	StageResponseDto.stageType.SCREENING,
	// ];

	console.log(params);

	return (
		<Section className={"!py-0"}>
			{`1. current stage -> NIE MA :) // jak null to nie ma kafelka
				2. wszystkie mecze MatchService.getMatches(params.tournamentAbbreviation) jako liczba -> klikalne do /matches, pofiltrować w stage z pkt 1.
				3. liczba meczy jak wyżej ale teraz bez references (sędziego)
				4. unikalna liczba staff membersów -> klikalne do /staff-members StaffMemberService.getStaffMembers(params.tournamentAbbreviation)
			`}
			{/*<div className={"flex w-full flex-col gap-4"}>*/}
			{/*	<h1 className={"my-2 text-3xl"}>{tournamentData.name}</h1>*/}
			{/*	<div className={"flex flex-col"}>*/}
			{/*<AddStageForm*/}
			{/*	tournamentAbb={params.tournamentAbbreviation}*/}
			{/*	alreadyAddedStages={getStagesData.map((stage) => {*/}
			{/*		return stage.stageType;*/}
			{/*	})}*/}
			{/*/>*/}
			{/*	</div>*/}
			{/*	<div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>*/}
			{/*		{getStagesData.map((stage) => {*/}
			{/*			return (*/}
			{/*				<div*/}
			{/*					key={stage.id}*/}
			{/*					className={"bg-gray-200 flex flex-col gap-2 rounded-md p-4"}*/}
			{/*				>*/}
			{/*					<p>{stageTypeEnumToString(stage.stageType)}</p>*/}
			{/*					<p>Start date: {stage.startDate}</p>*/}
			{/*					<p>End date: {stage.endDate}</p>*/}
			{/*					{stageWithoutMappool.includes(stage.stageType) ? null : (*/}
			{/*						<Mappool*/}
			{/*							tournamentAbb={params.tournamentAbbreviation}*/}
			{/*							stageType={stage.stageType}*/}
			{/*							isMappoolCreated={stage.mappool !== null}*/}
			{/*							mappoolId={stage?.mappool?.id}*/}
			{/*						/>*/}
			{/*					)}*/}
			{/*				</div>*/}
			{/*			);*/}
			{/*		})}*/}
			{/*	</div>*/}
			{/*</div>*/}
		</Section>
	);
};

export default DashboardHome;

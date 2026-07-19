import React from "react";
import Link from "next/link";
import { type StageResponseDto } from "../../../../client";
import { compareStageTypes, mappoolLabel } from "@/lib/helpers";

interface StageNavigationProps {
	stages: StageResponseDto[];
	currentStage: StageResponseDto["stageType"];
	tournamentAbbreviation: string;
}

export const StageNavigation = ({
	stages,
	currentStage,
	tournamentAbbreviation,
}: StageNavigationProps) => {
	const availableStages = stages
		.filter((stage) => !!stage.mappool)
		// Stages flagged off the schedule are rounds that borrow another stage's pool (Swiss 3-5, say),
		// so they get no pool entry of their own. Must stay in sync with the navbar Mappool dropdown
		// in tournament/[tournamentId]/layout.tsx.
		.filter((stage) => stage.showInSchedule !== false)
		.filter((stage) => stage.stageType !== "REGISTRATION")
		.filter((stage) => stage.stageType !== "SCREENING")
		.sort((a, b) => compareStageTypes(a.stageType, b.stageType));

	return (
		<div className="w-full bg-gray-800 border-b border-gray-700">
			<div className="container mx-auto">
				<div className="flex overflow-x-auto scrollbar-hide px-8 md:px-18 lg:px-20">
					{availableStages.map((stage) => {
						const isActive = stage.stageType === currentStage;
						return (
							<Link
								key={stage.id}
								href={`/tournament/${tournamentAbbreviation}/mappool/${stage.stageType}`}
								className={`px-6 py-4 text-white font-medium whitespace-nowrap transition-all border-b-2 ${
									isActive
										? "border-white font-bold"
										: "border-transparent hover:border-gray-500 hover:text-gray-300"
								}`}
							>
								{mappoolLabel(stage.stageType, stage.mappool?.displayName)}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};


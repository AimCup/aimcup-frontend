import React from "react";
import Link from "next/link";
import { type StageResponseDto } from "../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";

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
		.filter((stage) => stage.stageType !== "REGISTRATION")
		.filter((stage) => stage.stageType !== "SCREENING")
		.sort((a, b) => {
			// Sort stages in tournament order
			const order = [
				"QUALIFICATION",
				"RO128",
				"RO64",
				"RO32",
				"RO16",
				"QUARTER_FINAL",
				"SEMI_FINAL",
				"FINAL",
				"GRAND_FINAL",
			];
			const aIndex = order.indexOf(a.stageType);
			const bIndex = order.indexOf(b.stageType);
			return aIndex - bIndex;
		});

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
								{stageTypeEnumToString(stage.stageType)}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};


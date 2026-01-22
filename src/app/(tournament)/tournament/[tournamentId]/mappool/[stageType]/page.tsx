import React from "react";
import { cookies } from "next/headers";
import {
	type BeatmapModificationResponseDto,
	client,
	getMappoolByStage,
	getStages,
	type StageResponseDto,
} from "../../../../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";
import { BeatmapListItem } from "@ui/molecules/BeatmapListItem/BeatmapListItem";
import { StageNavigation } from "@ui/organisms/StageNavigation/StageNavigation";
import Section from "@ui/atoms/Section/Section";
import { Button } from "@ui/atoms/Button/Button";

const SingleTournamentMappool = async ({
	params,
	searchParams,
}: {
	params: {
		tournamentId: string;
		stageType: StageResponseDto["stageType"];
	};
	searchParams: {
		modification: BeatmapModificationResponseDto["modification"];
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
	
	let getMappoolByStageData;
	try {
		const { data: getMappoolByStageData1 } = await getMappoolByStage({
			path: {
				abbreviation: params.tournamentId,
				stageType: params.stageType,
			},
		});
		getMappoolByStageData = getMappoolByStageData1;
	} catch (error) {
		console.error(error);
	}

	const { data: getStagesData } = await getStages({
		path: {
			abbreviation: params.tournamentId,
		},
	});

	// Collect all beatmaps from all modifications, sorted
	const allBeatmaps = getMappoolByStageData?.beatmapsModifications
		.flatMap((bm) =>
			bm?.beatmaps
				?.filter((map) => {
					if (!searchParams.modification) {
						return true;
					}
					return map.modification === searchParams.modification;
				})
				?.map((map) => ({
					...map,
					modification: bm.modification,
				})) || [],
		)
		.sort((a, b) => {
			// Sort by modification first, then by position
			if (a.modification !== b.modification) {
				const modOrder = ["NM", "HD", "HR", "DT", "FM", "TB"];
				const aIndex = modOrder.indexOf(a.modification || "");
				const bIndex = modOrder.indexOf(b.modification || "");
				return aIndex - bIndex;
			}
			return a.position - b.position;
		}) || [];

	return (
		<>
			{getStagesData && (
				<StageNavigation
					stages={getStagesData}
					currentStage={params.stageType}
					tournamentAbbreviation={params.tournamentId}
				/>
			)}
			<Section id="mappool" className={"flex-col"}>
				<div className={"mb-6 flex items-center justify-between"}>
					<div className={"flex flex-col gap-2"}>
						<h2 className={"text-4xl font-bold "}>Mappool</h2>
						<h2 className={"text-2xl font-bold "}>
							{stageTypeEnumToString(params.stageType)}
						</h2>
					</div>
					{getMappoolByStageData?.downloadUrl && (
						<Button href={getMappoolByStageData.downloadUrl}>Download mappool pack</Button>
					)}
				</div>

				<div className="flex flex-col gap-3">
					{allBeatmaps.map((map) => (
						<BeatmapListItem
							key={map.id}
							href={`https://osu.ppy.sh/beatmapsets/${map.beatmapsetId}#osu/${map.beatmapId}`}
							title={map.title}
							artist={map.artist}
							version={map.version}
							creator={map.creator}
							modification={map.modification}
							position={map.position}
							isCustom={map.isCustom}
							img={map.normalCover}
							mapInformation={{
								stars: map.beatmapStatistics.starRating,
								time: map.beatmapStatistics.length,
								bpm: map.beatmapStatistics.bpm,
								ar: map.beatmapStatistics.ar,
								hp: map.beatmapStatistics.hp,
								od: map.beatmapStatistics.od,
								cs: map.beatmapStatistics.cs,
							}}
							_tournamentAbbreviation={params.tournamentId}
							_beatmapId={map.beatmapId}
							_beatmapsetId={map.beatmapsetId}
						/>
					))}
				</div>
			</Section>
		</>
	);
};

export default SingleTournamentMappool;

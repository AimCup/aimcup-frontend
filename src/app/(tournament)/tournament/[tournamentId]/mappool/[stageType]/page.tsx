import React from "react";
import { cookies } from "next/headers";
import {
	type BeatmapModificationResponseDto,
	client,
	getMappoolByStage,
	type StageResponseDto,
} from "../../../../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";
import { MappoolCard } from "@ui/molecules/Cards/MappoolCard";
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

	return (
		<>
			<Section id="mappool" className={"flex-col"}>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4"}>
						<h2 className={"text-4xl font-bold "}>Mappool</h2>
						<h2 className={"text-2xl font-bold "}>
							{stageTypeEnumToString(params.stageType)}
						</h2>
					</div>
				</div>

				{getMappoolByStageData?.downloadUrl && (
					<Button href={getMappoolByStageData.downloadUrl}>Download mappool pack</Button>
				)}

				{getMappoolByStageData?.beatmapsModifications.map((bm) => (
					<div className={"mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2"} key={bm.id}>
						{bm?.beatmaps
							?.filter((map) => {
								if (!searchParams.modification) {
									return true;
								}
								return map.modification === searchParams.modification;
							})
							?.map((map) => (
								<MappoolCard
									href={`https://osu.ppy.sh/beatmapsets/${map.beatmapsetId}#osu/${map.beatmapId}`}
									key={map.id}
									version={map.version}
									title={map.title}
									// modification={searchParams.modification as modification}
									modification={map.modification}
									author={map.creator}
									isCustom={map.isCustom}
									position={map.position}
									mapInformation={{
										stars: map.beatmapStatistics.starRating,
										time: map.beatmapStatistics.length,
										bpm: map.beatmapStatistics.bpm,
										ar: map.beatmapStatistics.ar,
										hp: map.beatmapStatistics.hp,
										od: map.beatmapStatistics.od,
										cs: map.beatmapStatistics.cs,
									}}
									img={map.normalCover}
								/>
							))}
					</div>
				))}
			</Section>
		</>
	);
};

export default SingleTournamentMappool;

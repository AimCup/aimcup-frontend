import React from "react";
import Image from "next/image";
import { AdminMappoolService, type StageResponseDto } from "../../../../../../../../../generated";
import Section from "@ui/atoms/Section/Section";
import { stageTypeEnumToString } from "@/lib/helpers";
import { Button } from "@ui/atoms/Button/Button";
import { AddBeatMap } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/mappool/[stageType]/[mappoolId]/AddBeatMap";
import { executeFetch } from "@/lib/executeFetch";

const StageTypePage = async ({
	params: { tournamentAbbreviation, stageType, mappoolId },
}: {
	params: {
		tournamentAbbreviation: string;
		stageType: StageResponseDto.stageType;
		mappoolId: string;
	};
}) => {
	const getMappoolData = await executeFetch(
		AdminMappoolService.getMappool(tournamentAbbreviation, stageType),
	);

	if (!getMappoolData.status) {
		return <div>{getMappoolData.errorMessage}</div>;
	}

	return (
		<Section className={"flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
				{stageTypeEnumToString(stageType)}
			</h2>
			<form
				className={"mb-3"}
				action={async (_e) => {
					"use server";
					await executeFetch(
						AdminMappoolService.releaseMappool(
							tournamentAbbreviation,
							stageType,
							!getMappoolData.response.isReleased,
						),
						["/", "/dashboard/[tournamentAbb]/mappool/[stageType]/[mappoolId]"],
					);
				}}
			>
				<Button className={"max-w-max"} type={"submit"}>
					{getMappoolData.response.isReleased ? "Unrelease" : "Release"} mappool
				</Button>
			</form>
			<AddBeatMap tournamentAbb={tournamentAbbreviation} mappoolId={mappoolId} />
			<div className="mt-3 overflow-x-auto">
				<table className="table">
					{/* head */}
					<thead>
						{/* mod, title , version , CS, OD, AR, HP, SR, BPM, length, creator, is custom, actions*/}
						<tr>
							<th>MOD</th>
							<th>Title</th>
							<th>Version</th>
							<th>CS</th>
							<th>OD</th>
							<th>AR</th>
							<th>HP</th>
							<th>SR</th>
							<th>BPM</th>
							<th>Length</th>
							<th>Creator</th>
							<th>Is custom</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{getMappoolData.response.beatmapsModifications.map(
							(mappool) =>
								mappool.beatmaps?.map((beatmap) => (
									<tr key={beatmap.id}>
										<td>
											<span className="badge badge-ghost badge-sm block">
												{mappool.modification}
												{beatmap.position + 1}
											</span>
										</td>
										<td className={"relative"}>
											<span className={"z-10"}>{beatmap.title}</span>
											<Image
												src={beatmap.cardCover}
												alt={beatmap.title}
												fill={true}
												className={"z-0 opacity-20"}
											/>
										</td>
										<td>{beatmap.version}</td>
										<td>{beatmap.beatmapStatistics.cs.toFixed(2)}</td>
										<td>{beatmap.beatmapStatistics.od.toFixed(2)}</td>
										<td>{beatmap.beatmapStatistics.ar.toFixed(2)}</td>
										<td>{beatmap.beatmapStatistics.hp.toFixed(2)}</td>
										<td>{beatmap.beatmapStatistics.starRating.toFixed(2)}</td>
										<td>{beatmap.beatmapStatistics.bpm}</td>
										<td>{beatmap.beatmapStatistics.length}</td>
										<td>{beatmap.creator}</td>
										<td>
											{beatmap.isCustom && (
												<Image
													src={"/aim_logo.svg"}
													alt={"custom"}
													width={20}
													height={20}
												/>
											)}
										</td>
										<td>
											<form
												action={async (_e) => {
													"use server";
													await executeFetch(
														AdminMappoolService.deleteBeatmap(
															tournamentAbbreviation,
															mappoolId,
															mappool.modification,
															beatmap.id,
														),
														[
															"/",
															"/dashboard/[tournamentAbb]/mappool/[stageType]/[mappoolId]",
														],
													);
												}}
											>
												<button
													className="btn btn-ghost btn-xs"
													type={"submit"}
												>
													delete
												</button>
											</form>
										</td>
									</tr>
								)),
						)}
					</tbody>
				</table>
			</div>
		</Section>
	);
};

export default StageTypePage;

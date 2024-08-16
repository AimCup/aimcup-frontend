import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import {
	client,
	deleteBeatmap,
	getMappool,
	releaseMappool,
	type stageType,
} from "../../../../../../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";
import { Button } from "@ui/atoms/Button/Button";
import { AddBeatMap } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/mappool/[stageType]/[mappoolId]/AddBeatMap";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

const StageTypePage = async ({
	params: { tournamentAbbreviation, stageType, mappoolId },
}: {
	params: {
		tournamentAbbreviation: string;
		stageType: stageType;
		mappoolId: string;
	};
}) => {
	const { data: getMappoolData, error } = await getMappool({
		path: {
			stageType,
			abbreviation: tournamentAbbreviation,
		},
	});

	if (error) {
		return <div>{error.errors?.map((e) => e)}</div>;
	}

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
				{stageTypeEnumToString(stageType)}
			</h2>
			<form
				className={"mb-3"}
				action={async (_e) => {
					"use server";
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
					await releaseMappool({
						path: {
							stageType,
							abbreviation: tournamentAbbreviation,
						},
						query: {
							release: !getMappoolData.isReleased,
						},
					});

					await multipleRevalidatePaths([
						"/",
						`/dashboard/${tournamentAbbreviation}/mappool/${stageType}/${mappoolId}`,
					]);
				}}
			>
				<Button className={"max-w-max"} type={"submit"}>
					{getMappoolData.isReleased ? "Unrelease" : "Release"} mappool
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
						{getMappoolData.beatmapsModifications.map(
							(mappool) =>
								mappool.beatmaps?.map((beatmap) => (
									<tr key={beatmap.id}>
										<td>
											<span className="badge badge-ghost badge-sm block">
												{mappool.modification}
												{beatmap.position}
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
													await deleteBeatmap({
														path: {
															abbreviation: tournamentAbbreviation,
															mappoolId,
															modification: mappool.modification,
															beatmapId: beatmap.id,
														},
													});
													await multipleRevalidatePaths([
														"/",
														`/dashboard/${tournamentAbbreviation}/mappool/${stageType}/${mappoolId}`,
													]);
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
		</div>
	);
};

export default StageTypePage;

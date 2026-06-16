import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import {
	client,
	getMappool,
	type stageType,
	type modification,
} from "../../../../../../../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";
import { AddBeatMap } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/mappool/[stageType]/[mappoolId]/AddBeatMap";
import {
	DeleteBeatmapButton,
	ReleaseMappoolButton,
	ToggleOriginalSongButton,
} from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/mappool/[stageType]/[mappoolId]/MappoolRowActions";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const StageTypePage = async ({
	params: { tournamentAbbreviation, stageType, mappoolId },
}: {
	params: {
		tournamentAbbreviation: string;
		stageType: stageType;
		mappoolId: string;
	};
}) => {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { data: getMappoolData, error } = await getMappool({
		path: {
			stageType,
			abbreviation: tournamentAbbreviation,
		},
	});

	if (error) {
		return <div>{error.errors?.map((e) => e)}</div>;
	}

	// Flatten all beatmaps for the empty-state check
	const totalBeatmaps = getMappoolData.beatmapsModifications.reduce(
		(acc, mod) => acc + (mod.beatmaps?.length ?? 0),
		0,
	);

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title={stageTypeEnumToString(stageType)}
				subtitle="Manage beatmaps and release state for this mappool."
				actions={
					<ReleaseMappoolButton
						tournamentAbbreviation={tournamentAbbreviation}
						stageType={stageType}
						mappoolId={mappoolId}
						isReleased={getMappoolData.isReleased}
					/>
				}
			/>

			<Card
				title="Beatmaps"
				headerAction={
					<AddBeatMap
						tournamentAbb={tournamentAbbreviation}
						mappoolId={mappoolId}
						stageType={stageType}
					/>
				}
				className="p-0"
			>
				<div className="overflow-x-auto">
					<table className="table">
						{/* mod, title, version, CS, OD, AR, HP, SR, BPM, length, creator, is custom, original song, actions */}
						<thead>
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
								<th>Original song</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{totalBeatmaps === 0 ? (
								<tr>
									<td colSpan={14} className="py-8 text-center text-white/40">
										No beatmaps yet. Use &quot;Add beatmap&quot; to add the first one.
									</td>
								</tr>
							) : (
								getMappoolData.beatmapsModifications.map((mappool) =>
									mappool.beatmaps?.map((beatmap) => (
										<tr key={beatmap.id}>
											<td>
												<span className="badge badge-ghost badge-sm block">
													{mappool.modification}
													{beatmap.position}
												</span>
											</td>
											<td className="relative">
												<span className="z-10">{beatmap.title}</span>
												<Image
													src={beatmap.cardCover}
													alt={beatmap.title}
													fill={true}
													className="z-0 opacity-20"
												/>
											</td>
											<td>{beatmap.version}</td>
											<td>{beatmap.beatmapStatistics.cs.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.od.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.ar.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.hp.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.starRating.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.bpm.toFixed(2)}</td>
											<td>{beatmap.beatmapStatistics.length}</td>
											<td>{beatmap.creator}</td>
											<td>
												{beatmap.isCustom && (
													<Image
														src="/aim_logo.svg"
														alt="custom"
														width={20}
														height={20}
													/>
												)}
											</td>
											<td>
												<ToggleOriginalSongButton
													tournamentAbbreviation={tournamentAbbreviation}
													stageType={stageType}
													mappoolId={mappoolId}
													beatmapId={beatmap.id}
													isCustomSong={beatmap.isCustomSong ?? false}
												/>
											</td>
											<td>
												<DeleteBeatmapButton
													tournamentAbbreviation={tournamentAbbreviation}
													stageType={stageType}
													mappoolId={mappoolId}
													beatmapModification={mappool.modification as modification}
													beatmapId={beatmap.id}
													beatmapTitle={beatmap.title}
												/>
											</td>
										</tr>
									)),
								)
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};

export default StageTypePage;

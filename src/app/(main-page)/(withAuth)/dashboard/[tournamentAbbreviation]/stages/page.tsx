import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { StageForm } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/stages/StageForm";
import { multipleRevalidatePaths, stageTypeEnumToString } from "@/lib/helpers";
import {
	deleteStage,
	getStages,
	getTournamentByAbbreviation,
	stageType,
} from "../../../../../../../client";

const StagePage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
	};
}) => {
	const { data: getStagesData } = await getStages({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const stageWithoutMappool = [stageType.REGISTRATION, stageType.SCREENING];

	return (
		<div className={"flex w-full flex-col !px-3 !py-2"}>
			<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Stages</h2>
			<StageForm
				modalType={{
					type: "add",
				}}
				tournamentAbb={tournamentAbbreviation}
				alreadyAddedStages={
					getStagesData?.map((stage) => {
						return stage.stageType as stageType;
					}) || []
				}
			/>

			<div className="mt-10 overflow-x-auto">
				<table className="table w-full">
					{/* head */}
					<thead>
						<tr>
							<th>Stage type</th>
							<th>Date start</th>
							<th>Date end</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{getStagesData
							?.sort((a, b) => {
								return (
									new Date(a.startDate).getTime() -
									new Date(b.startDate).getTime()
								);
							})
							.map((stage) => {
								return (
									<tr key={stage.id}>
										<td>{stageTypeEnumToString(stage.stageType)}</td>
										<td>{format(new Date(stage.startDate), "dd/MM/yyyy")}</td>
										<td>{format(new Date(stage.endDate), "dd/MM/yyyy")}</td>
										<td>
											<StageForm
												modalType={{
													type: "edit",
													stage: {
														stageType: stage.stageType,
														dateStart: stage.startDate,
														dateEnd: stage.endDate,
													},
												}}
												tournamentAbb={tournamentAbbreviation}
											/>
											<form
												action={async (_e) => {
													"use server";
													await deleteStage({
														path: {
															abbreviation: tournamentAbbreviation,
															stageType: stage.stageType,
														},
													});
													multipleRevalidatePaths([
														"/",
														`/dashboard/${tournamentAbbreviation}/stages`,
													]);
												}}
											>
												<button
													className="btn btn-ghost btn-xs"
													type={"submit"}
												>
													Delete
												</button>
											</form>
											{stageWithoutMappool.includes(
												stage?.stageType as stageType,
											) ? null : (
												<button className="btn btn-ghost btn-xs">
													<Link
														href={`
													/dashboard/${tournamentAbbreviation}/mappool/${stage.stageType}/${stage.mappool?.id}
												`}
													>
														View
													</Link>
												</button>
											)}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StagePage;

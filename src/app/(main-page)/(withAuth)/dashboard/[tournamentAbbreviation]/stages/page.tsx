import React from "react";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { client, getStages, stageType } from "../../../../../../../client";
import { StageForm } from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/stages/StageForm";
import { stageTypeEnumToString } from "@/lib/helpers";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";
import {
	DeleteStageButton,
	ViewMappoolButton,
} from "@/app/(main-page)/(withAuth)/dashboard/[tournamentAbbreviation]/stages/StageRowActions";

const StagePage = async ({
	params: { tournamentAbbreviation },
}: {
	params: {
		tournamentAbbreviation: string;
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

	const { data: getStagesData } = await getStages({
		path: {
			abbreviation: tournamentAbbreviation,
		},
	});

	const stageWithoutMappool = [stageType.REGISTRATION, stageType.SCREENING];

	const sortedStages = (getStagesData ?? []).sort(
		(a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
	);

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Stages"
				subtitle="Manage tournament stages, dates and mappools."
				actions={
					<StageForm
						modalType={{ type: "add" }}
						tournamentAbb={tournamentAbbreviation}
						alreadyAddedStages={
							getStagesData?.map((stage) => stage.stageType as stageType) || []
						}
					/>
				}
			/>

			<Card className="p-0">
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
							<tr>
								<th>Stage type</th>
								<th>Date start</th>
								<th>Date end</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{sortedStages.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-8 text-center text-white/40">
										No stages yet. Add the first stage above.
									</td>
								</tr>
							) : (
								sortedStages.map((stage) => (
									<tr key={stage.id}>
										<td>{stageTypeEnumToString(stage.stageType)}</td>
										<td>{format(new Date(stage.startDate), "dd/MM/yyyy")}</td>
										<td>{format(new Date(stage.endDate), "dd/MM/yyyy")}</td>
										<td>
											<div className="flex items-center gap-1">
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
												<DeleteStageButton
													tournamentAbbreviation={tournamentAbbreviation}
													stageTypeValue={stage.stageType as stageType}
													stageLabel={stageTypeEnumToString(stage.stageType)}
												/>
												{!stageWithoutMappool.includes(stage?.stageType as stageType) && (
													<ViewMappoolButton
														tournamentAbbreviation={tournamentAbbreviation}
														stageTypeValue={stage.stageType}
														mappoolId={stage.mappool?.id}
													/>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};

export default StagePage;

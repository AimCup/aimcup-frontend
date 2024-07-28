import React from "react";
import {
	type MappoolResponseDto,
	MappoolService,
	type StageResponseDto,
} from "../../../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";

interface IAddStageFormProps {
	tournamentAbb: string;
	stageType: StageResponseDto.stageType;
	isMappoolCreated: boolean;
	mappoolId?: string;
}

export const Mappool = ({
	tournamentAbb,
	stageType,
	mappoolId,
	isMappoolCreated,
}: IAddStageFormProps) => {
	console.log(mappoolId, "mappoolId");

	const createMappoolAction = async (_formData: FormData) => {
		"use server";

		return executeFetch(MappoolService.createMappool(tournamentAbb, stageType), [
			"/",
			"/dashboard",
		])
			.then((res) => {
				console.log(res);
				return res as SuccessfulResponse<MappoolResponseDto>;
			})
			.catch((error) => error as ErrorResponse);
	};

	if (isMappoolCreated) {
		return (
			<>
				<Button
					href={`/dashboard/${tournamentAbb}/${mappoolId}/${stageType}`}
					className={"w-full"}
				>
					Show mappool
				</Button>
			</>
		);
	}

	return (
		<>
			<form action={createMappoolAction} id={"create-mappool"}>
				<Button className={"w-full"} type={"submit"} disabled={isMappoolCreated}>
					Create mappool
				</Button>
			</form>
		</>
	);
};

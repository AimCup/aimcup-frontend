"use server";

import { type ParticipantResponseDto, ParticipantService } from "../../generated";
import { type ErrorResponse, executeFetch, type SuccessfulResponse } from "@/lib/executeFetch";

export async function addBeatMapAction(data: FormData) {
	"use server";
	const tournamentAbb = data.get("tournamentAbb") as string;

	return executeFetch(ParticipantService.registerParticipant(tournamentAbb), [
		"/",
		"/dashboard",
		"tournament",
		"registration",
	])
		.then((res) => {
			console.log(res);
			return res as SuccessfulResponse<ParticipantResponseDto[]>;
		})
		.catch((error) => {
			console.log(error);
			return error as ErrorResponse;
		});
}

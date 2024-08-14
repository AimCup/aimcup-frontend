import React from "react";
import { ParticipantService } from "../../../../generated";
import { Button } from "@ui/atoms/Button/Button";
import { executeFetch } from "@/lib/executeFetch";

interface RegisterToTournamentButtonProps {
	tournamentId: string;
	isTeamTournament: boolean;
	shouldDisplay: boolean;
}

const RegisterToTournamentButton = ({
	tournamentId,
	isTeamTournament,
	shouldDisplay,
}: RegisterToTournamentButtonProps) => {
	if (!shouldDisplay) {
		return null;
	}

	if (!isTeamTournament) {
		return (
			<form
				action={async (_e) => {
					"use server";
					await executeFetch(ParticipantService.registerParticipant(tournamentId), [
						"/",
						"/dashboard",
						"/tournament/[tournamentId]",
						"/registration",
					]);
				}}
			>
				<Button type={"submit"}>Join to the tournament</Button>
			</form>
		);
	} else {
		return <Button href={`/tournament/${tournamentId}/registration`}>Create team</Button>;
	}
};

export default RegisterToTournamentButton;

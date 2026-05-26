import React from "react";
import { registerParticipant, tournamentType } from "../../../../client";
import { Button } from "@ui/atoms/Button/Button";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

interface RegisterToTournamentButtonProps {
	tournamentId: string;
	isTeamTournament: boolean;
	tournamentType: tournamentType;
	shouldDisplay: boolean;
}

const RegisterToTournamentButton = ({
	tournamentId,
	isTeamTournament,
	tournamentType: type,
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
					await registerParticipant({
						path: {
							abbreviation: tournamentId,
						},
					});
					await multipleRevalidatePaths([
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
	}

	const label = type === tournamentType.AUCTION ? "Register" : "Create team";
	return <Button href={`/tournament/${tournamentId}/registration`}>{label}</Button>;
};

export default RegisterToTournamentButton;

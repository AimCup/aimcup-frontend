"use client";
import React from "react";
import { Button, type ButtonProps } from "@ui/atoms/Button/Button";
import { addBeatMapAction } from "@/actions/public/participianJoinToTheTournamentAction";

interface RegisterToTournamentButtonProps {
	tournamentId: string;
	isTeamTournament: boolean;
}

const RegisterToTournamentButton = ({
	tournamentId,
	isTeamTournament,
}: RegisterToTournamentButtonProps) => {
	const buttonProps: ButtonProps = {
		children: "Create team",
		href: `/tournament/${tournamentId}/registration`,
	};

	// if (!user.id) {
	// 	const redirectUri = encodeURIComponent(
	// 		`${process.env.NEXT_PUBLIC_URL}/tournament/${tournamentId}/registration`,
	// 	);
	// 	buttonProps = {
	// 		href: `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`,
	// 		children: "Log in to register",
	// 	};
	// }

	if (!isTeamTournament) {
		return (
			<form action={addBeatMapAction}>
				<input type="hidden" name="tournamentAbb" value={tournamentId} />
				<Button type={"submit"}>Join to the tournament</Button>
			</form>
		);
	}

	return <Button {...buttonProps} />;
};

export default RegisterToTournamentButton;

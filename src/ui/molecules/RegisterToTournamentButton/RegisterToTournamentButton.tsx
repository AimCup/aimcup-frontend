"use client";
import React from "react";
import type { UserResponseDTO } from "../../../../generated";
import { Button, type ButtonProps } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";

interface RegisterToTournamentButtonProps {
	isRegisteredToTournament: boolean;
	tournamentId: string;
}

const RegisterToTournamentButton = ({
	isRegisteredToTournament,
	tournamentId,
}: RegisterToTournamentButtonProps) => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	let buttonProps: ButtonProps = {
		children: "Register",
		href: `/tournament/${tournamentId}/registration`,
	};

	if (!user.id) {
		const redirectUri = encodeURIComponent(
			`${process.env.URL}/tournament/${tournamentId}/registration`,
		);
		buttonProps = {
			href: `${process.env.API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`,
			children: "Log in",
		};
	}

	if (isRegisteredToTournament) {
		buttonProps = {
			children: "Already registered",
			disabled: isRegisteredToTournament,
		};
	}

	return <Button {...buttonProps} />;
};

export default RegisterToTournamentButton;

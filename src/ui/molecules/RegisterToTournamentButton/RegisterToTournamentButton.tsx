"use client";
import React from "react";
import type { UserResponseDTO } from "../../../../generated";
import { Button, type ButtonProps } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";

interface RegisterToTournamentButtonProps {
	tournamentId: string;
}

const RegisterToTournamentButton = ({ tournamentId }: RegisterToTournamentButtonProps) => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	let buttonProps: ButtonProps = {
		children: "Create team",
		href: `/tournament/${tournamentId}/registration`,
	};

	if (!user.id) {
		const redirectUri = encodeURIComponent(
			`${process.env.NEXT_PUBLIC_URL}/tournament/${tournamentId}/registration`,
		);
		buttonProps = {
			href: `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`,
			children: "Log in to register",
		};
	}

	return <Button {...buttonProps} />;
};

export default RegisterToTournamentButton;

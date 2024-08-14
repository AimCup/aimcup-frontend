"use client";
import React from "react";

export const CopyInvitationLinkButton = ({
	tournamentAbb,
	teamId,
}: {
	tournamentAbb: string;
	teamId: string;
}) => {
	const handleCopyToClipboard = async () => {
		const link = `${window.location.origin}/tournament/${tournamentAbb}/teams/${teamId}/join`;
		await navigator.clipboard.writeText(link);
	};

	return (
		<button className="btn btn-ghost btn-xs" onClick={handleCopyToClipboard}>
			copy invitation link
		</button>
	);
};

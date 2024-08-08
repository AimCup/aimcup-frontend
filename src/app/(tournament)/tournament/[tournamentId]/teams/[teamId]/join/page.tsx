import React from "react";
import { redirect } from "next/navigation";
import { TeamService } from "../../../../../../../../generated";
import { getUser } from "@/actions/public/getUserAction";
import Section from "@ui/atoms/Section/Section";
import { executeFetch } from "@/lib/executeFetch";

const AcceptInvitationPage = async ({
	teamId,
	tournamentAbb,
}: {
	teamId: string;
	tournamentAbb: string;
}) => {
	const userData = await getUser();

	if (!userData) {
		return (
			<Section>
				To accept an invitation to join the team, you must log in and try again
			</Section>
		);
	}

	const acceptInvitationResponse = await executeFetch(
		TeamService.acceptInvite(tournamentAbb, teamId),
		["/", `tournaments/${tournamentAbb}/teams/${teamId}`, `tournaments/${tournamentAbb}`],
	);

	if (!acceptInvitationResponse.status) {
		return <Section>{acceptInvitationResponse.errorMessage}</Section>;
	}

	if (acceptInvitationResponse.status) {
		redirect(`tournaments/${tournamentAbb}/teams/${teamId}`);
	}
};

export default AcceptInvitationPage;

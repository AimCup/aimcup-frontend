import React from "react";
import { cookies } from "next/headers";
import { client, getAuctionCaptains, getParticipants1 } from "../../../../../../../client";
import CaptainDesignationPanel from "./CaptainDesignationPanel";
import AuctionResultsUploadPanel from "./AuctionResultsUploadPanel";
import SyncSpreadsheetButton from "./SyncSpreadsheetButton";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";

const AuctionPage = async ({
	params: { tournamentAbbreviation },
}: {
	params: { tournamentAbbreviation: string };
}) => {
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const [{ data: participants, error: participantsError }, { data: captainTeams, error: captainsError }] =
		await Promise.all([
			getParticipants1({ path: { abbreviation: tournamentAbbreviation } }),
			getAuctionCaptains({ path: { abbreviation: tournamentAbbreviation } }),
		]);

	if (participantsError || captainsError) {
		return <div className="p-8 text-error">Failed to load auction data.</div>;
	}

	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Auction Management"
				subtitle="Designate captains, manage participants, and import auction results."
				actions={<SyncSpreadsheetButton tournamentAbbreviation={tournamentAbbreviation} />}
			/>

			<CaptainDesignationPanel
				participants={participants ?? []}
				captainTeams={captainTeams ?? []}
				tournamentAbbreviation={tournamentAbbreviation}
			/>

			<AuctionResultsUploadPanel tournamentAbbreviation={tournamentAbbreviation} />
		</div>
	);
};

export default AuctionPage;

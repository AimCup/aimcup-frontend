import React from "react";
import { cookies } from "next/headers";
import { client, getAuctionCaptains, getParticipants1 } from "../../../../../../../client";
import CaptainDesignationPanel from "./CaptainDesignationPanel";
import AuctionResultsUploadPanel from "./AuctionResultsUploadPanel";
import SyncSpreadsheetButton from "./SyncSpreadsheetButton";

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
        <div className="flex flex-col gap-12 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Auction Management</h1>
                <SyncSpreadsheetButton tournamentAbbreviation={tournamentAbbreviation} />
            </div>
            <CaptainDesignationPanel
                participants={participants ?? []}
                captainTeams={captainTeams ?? []}
                tournamentAbbreviation={tournamentAbbreviation}
            />
            <div className="divider" />
            <AuctionResultsUploadPanel tournamentAbbreviation={tournamentAbbreviation} />
        </div>
    );
};

export default AuctionPage;

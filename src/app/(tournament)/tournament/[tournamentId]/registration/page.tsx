import React from "react";
import { cookies } from "next/headers";
import { client, getTournamentByAbbreviation, tournamentType } from "../../../../../../client";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import TeamRegistrationForm from "./TeamRegistrationForm";

const SingleTournamentRegistration = async ({
    params,
}: {
    params: { tournamentId: string };
}) => {
    const cookie = cookies().get("JWT")?.value;
    client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
        headers: { Cookie: `JWT=${cookie}` },
    });

    const { data: tournament } = await getTournamentByAbbreviation({
        path: { abbreviation: params.tournamentId },
    });

    if (tournament?.tournamentType === tournamentType.AUCTION) {
        return <AuctionRegistrationForm tournamentId={params.tournamentId} />;
    }

    return <TeamRegistrationForm tournamentId={params.tournamentId} />;
};

export default SingleTournamentRegistration;

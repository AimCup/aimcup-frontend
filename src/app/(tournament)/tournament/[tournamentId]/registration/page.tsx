import React from "react";
import { cookies } from "next/headers";
import { client, getTournamentByAbbreviation, tournamentType } from "../../../../../../client";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import TeamRegistrationForm from "./TeamRegistrationForm";
import { getUser } from "@/actions/public/getUserAction";

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

    const [{ data: tournament }, userData] = await Promise.all([
        getTournamentByAbbreviation({ path: { abbreviation: params.tournamentId } }),
        getUser(),
    ]);

    const hasDiscord = !!userData?.discordId;

    if (tournament?.tournamentType === tournamentType.AUCTION) {
        return <AuctionRegistrationForm tournamentId={params.tournamentId} hasDiscord={hasDiscord} />;
    }

    return <TeamRegistrationForm tournamentId={params.tournamentId} />;
};

export default SingleTournamentRegistration;

import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { client, getParticipants } from "../../../../../../client";
import Section from "@ui/atoms/Section/Section";

const PlayersPage = async ({
    params: { tournamentId },
}: {
    params: { tournamentId: string };
}) => {
    const cookie = cookies().get("JWT")?.value;
    client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: { Cookie: `token=${cookie}` },
    });

    const { data: participants } = await getParticipants({
        path: { abbreviation: tournamentId },
    });

    const sorted = [...(participants ?? [])].sort((a, b) => {
        const ra = a.user.globalRank ?? 999999999;
        const rb = b.user.globalRank ?? 999999999;
        return ra - rb;
    });

    return (
        <Section className="flex-col">
            <h2 className="mb-8 text-4xl font-bold">
                Registered Players{" "}
                <span className="text-2xl font-normal text-gray-400">({sorted.length})</span>
            </h2>
            {sorted.length === 0 ? (
                <p className="text-gray-400">No players have registered yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((p) => (
                        <div
                            key={p.id}
                            className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl bg-tuned p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <Image
                                            src={`https://a.ppy.sh/${p.user.osuId}`}
                                            alt={p.user.username}
                                            width={48}
                                            height={48}
                                        />
                                    </div>
                                </div>
                                <div className="flex min-w-0 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        {p.user.countryCode && (
                                            <Image
                                                src={`https://flagcdn.com/h20/${p.user.countryCode.toLowerCase()}.png`}
                                                alt={p.user.countryCode}
                                                width={20}
                                                height={15}
                                                unoptimized
                                            />
                                        )}
                                        <span className="truncate font-bold">{p.user.username}</span>
                                    </div>
                                    <div className="flex gap-3 text-xs text-gray-400">
                                        {p.user.globalRank ? (
                                            <span>#<strong className="text-white">{p.user.globalRank.toLocaleString('en-US')}</strong> Global</span>
                                        ) : null}
                                        {p.user.countryRank ? (
                                            <span>#<strong className="text-white">{p.user.countryRank.toLocaleString('en-US')}</strong> {p.user.countryCode}</span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            {p.auctionMessage && (
                                <p className="break-words text-sm text-gray-300">&ldquo;{p.auctionMessage}&rdquo;</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
};

export default PlayersPage;

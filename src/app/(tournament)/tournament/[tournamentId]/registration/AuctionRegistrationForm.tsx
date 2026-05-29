"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@ui/atoms/Button/Button";
import Section from "@ui/atoms/Section/Section";
import { registerForAuctionAction } from "@/actions/public/registerForAuctionAction";
import { discordVerifyAction } from "@/actions/public/discordVerifyAction";

const AuctionRegistrationForm = ({
    tournamentId,
    hasDiscord,
}: {
    tournamentId: string;
    hasDiscord: boolean;
}) => {
    const [pending, setPending] = React.useState(false);
    const [registered, setRegistered] = React.useState(false);
    const [message, setMessage] = React.useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        const formData = new FormData(e.currentTarget);
        const wantsToBeCaptain = formData.get("wantsToBeCaptain") === "on";
        const auctionMessage = (formData.get("auctionMessage") as string) || "";
        const result = await registerForAuctionAction(tournamentId, wantsToBeCaptain, auctionMessage);
        setPending(false);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 3000 });
        } else {
            setRegistered(true);
        }
    }

    if (registered) {
        return (
            <Section className="flex-col items-center gap-6 py-16">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="text-6xl">🎉</div>
                    <h2 className="text-4xl font-bold">You&apos;re registered!</h2>
                    <p className="max-w-md text-gray-400">
                        You&apos;ve successfully signed up for the tournament. Captains will be selected
                        by the organizers, and teams will be formed after the auction. Keep an eye on
                        announcements!
                    </p>
                </div>
            </Section>
        );
    }

    return (
        <Section>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-bold leading-relaxed">
                        Register for this tournament
                    </h2>
                    <p className="text-base text-gray-400">
                        This is an auction tournament. Players sign up individually and
                        will be assigned to teams after the auction.
                    </p>
                </div>

                <div className="mb-6 flex w-full flex-col gap-4 rounded-xl bg-tuned p-8 lg:w-3/4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Disclaimer</h3>
                        <p className="text-base">
                            By registering for this tournament, you confirm that you meet the
                            eligibility requirements and agree to abide by all rules set by the
                            organizers. Participants are expected to behave respectfully and
                            fairly; any misconduct may result in disqualification.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                        Message for the auction{" "}
                        <span className="text-sm font-normal text-gray-400">(optional, max 360 characters)</span>
                    </label>
                    <textarea
                        name="auctionMessage"
                        className="textarea textarea-bordered w-full lg:w-3/4"
                        placeholder="Introduce yourself to the captains — your play style, strengths, availability, etc."
                        maxLength={360}
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <span className="text-right text-sm text-gray-400 lg:w-3/4">
                        {message.length}/360
                    </span>
                </div>

                <div className="form-control">
                    <label className="label flex cursor-pointer justify-start gap-4">
                        <input
                            type="checkbox"
                            name="wantsToBeCaptain"
                            className="checkbox"
                        />
                        <span className="label-text">
                            I&apos;d like to be considered as a captain
                        </span>
                    </label>
                </div>

                {!hasDiscord && (
                    <div className="flex items-center gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
                        <span>You must connect your Discord account before registering.</span>
                        <button
                            type="button"
                            onClick={() => discordVerifyAction()}
                            className="font-semibold underline hover:text-yellow-300"
                        >
                            Connect Discord
                        </button>
                    </div>
                )}

                <Button className="mt-2 w-max" type="submit" disabled={pending || !hasDiscord}>
                    {pending ? "Registering..." : "Register"}
                </Button>
            </form>
        </Section>
    );
};

export default AuctionRegistrationForm;

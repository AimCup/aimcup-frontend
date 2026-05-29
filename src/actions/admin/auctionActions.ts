"use server";

import { cookies } from "next/headers";
import {
    applyAuctionResults,
    client,
    deleteParticipant,
    designateCaptain,
    previewAuctionResults,
    removeCaptain,
} from "../../../client";
import { multipleRevalidatePaths } from "@/lib/multipleRevalidatePaths";

function configureClient() {
    const cookie = cookies().get("JWT")?.value;
    client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: { Cookie: `token=${cookie}` },
    });
}

export async function designateCaptainAction(abbreviation: string, participantId: string) {
    configureClient();
    const { data, error } = await designateCaptain({
        path: { abbreviation },
        body: { participantId },
    });
    if (error) {
        return { status: false as const, errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Failed" };
    }
    await multipleRevalidatePaths([`/dashboard/${abbreviation}/auction`]);
    return { status: true as const, response: data };
}

export async function removeCaptainAction(abbreviation: string, participantId: string) {
    configureClient();
    const { error } = await removeCaptain({
        path: { abbreviation, participantId },
    });
    if (error) {
        return { status: false as const, errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Failed" };
    }
    await multipleRevalidatePaths([`/dashboard/${abbreviation}/auction`]);
    return { status: true as const };
}

export async function previewAuctionResultsAction(abbreviation: string, formData: FormData) {
    configureClient();
    const file = formData.get("file") as File;
    if (!file) return { status: false as const, errorMessage: "No file provided" };
    const { data, error } = await previewAuctionResults({
        path: { abbreviation },
        body: { file },
    });
    if (error) {
        return { status: false as const, errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Invalid CSV" };
    }
    return { status: true as const, response: data };
}

export async function removeParticipantAction(abbreviation: string, osuId: string) {
    configureClient();
    const { error } = await deleteParticipant({
        path: { abbreviation, osuId },
    });
    if (error) {
        return { status: false as const, errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Failed" };
    }
    await multipleRevalidatePaths([`/dashboard/${abbreviation}/auction`]);
    return { status: true as const };
}

export async function applyAuctionResultsAction(abbreviation: string, formData: FormData) {
    configureClient();
    const file = formData.get("file") as File;
    if (!file) return { status: false as const, errorMessage: "No file provided" };
    const { data, error } = await applyAuctionResults({
        path: { abbreviation },
        body: { file },
    });
    if (error) {
        return { status: false as const, errorMessage: (error as { errors?: string[] }).errors?.join(", ") ?? "Failed to apply results" };
    }
    await multipleRevalidatePaths([
        `/dashboard/${abbreviation}/auction`,
        `/dashboard/${abbreviation}/teams`,
        `/tournament/${abbreviation}/teams`,
    ]);
    return { status: true as const, response: data };
}

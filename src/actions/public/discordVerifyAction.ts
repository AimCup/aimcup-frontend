"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { client, verify } from "../../../client";

export async function discordVerifyAction() {
    const cookie = cookies().get("JWT")?.value;
    client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: { Cookie: `token=${cookie}` },
    });
    const { data } = await verify();
    if (data?.redirectUri) {
        redirect(data.redirectUri);
    }
}

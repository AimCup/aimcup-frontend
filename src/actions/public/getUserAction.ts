import { cache } from "react";
import { cookies } from "next/headers";
import { client, me } from "../../../client";

export const getUser = cache(async () => {
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	if (cookie) {
		const { data } = await me();
		return data;
	}
	return null;
});

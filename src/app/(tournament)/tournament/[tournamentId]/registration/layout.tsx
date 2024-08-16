import React from "react";
import { cookies } from "next/headers";
import { client } from "../../../../../../client";
// todo po co to jest>?
export default function MainPageLayout({ children }: { children: React.ReactNode }) {
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
	return <div className={""}>{children}</div>;
}

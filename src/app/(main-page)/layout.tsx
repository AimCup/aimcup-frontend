import React from "react";
import NextTopLoader from "nextjs-toploader";
import { cookies } from "next/headers";
import { client } from "../../../client";
import { Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";
import { navigationList } from "@/lib/mainNavigation";
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";

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
	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={navigationList}>
				<LoginAvatar />
			</Navbar>
			{children}
			<Footer />
		</>
	);
}

import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "@next/font/google";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { client } from "../../client";

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

const monserrat = Montserrat({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

// configure internal service client
client.setConfig({
	// set default base url for requests
	baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
	// set default headers for requests
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	client.interceptors.request.use((req) => {
		const cookie = cookies().get("JWT")?.value;
		if (cookie) {
			req.headers.set("Cookie", `token=${cookie}`);
		}
		return req;
	});

	return (
		<html
			lang="en"
			className="scroll-smooth bg-primary-dark text-primary-light"
			style={{ scrollBehavior: "smooth" }}
		>
			<Toaster />
			<body className={monserrat.className}>
				<main className={"text-white"}>{children}</main>
			</body>
		</html>
	);
}

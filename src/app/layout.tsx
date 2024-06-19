import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { CookiesProvider } from "next-client-cookies/server";
import { OpenAPI, UserService } from "../../generated";
import StoreProvider from "@/app/StoreProvider";
import UserProvider from "@/app/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const token = cookies().get("token")?.value;

	OpenAPI.HEADERS = {
		Cookie: `token=${token}`,
	};
	const data = await UserService.me();

	return (
		<StoreProvider>
			<CookiesProvider>
				<UserProvider userData={data}>
					<html
						lang="en"
						className="scroll-smooth bg-primary-dark text-primary-light"
						style={{ scrollBehavior: "smooth" }}
					>
						<body className={inter.className}>{children}</body>
					</html>
				</UserProvider>
			</CookiesProvider>
		</StoreProvider>
	);
}

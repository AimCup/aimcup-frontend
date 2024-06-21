import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Montserrat } from "@next/font/google";
import { OpenAPI, UserService } from "../../generated";
import StoreProvider from "@/app/StoreProvider";
import UserProvider from "@/app/UserProvider";

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

const monserrat = Montserrat({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const token = cookies().get("token")?.value;

	OpenAPI.HEADERS = {
		Cookie: `token=${token}`,
	};
	const data = await UserService.me();

	return (
		<StoreProvider>
			<UserProvider userData={data}>
				<html
					lang="en"
					className="scroll-smooth bg-primary-dark text-primary-light"
					style={{ scrollBehavior: "smooth" }}
				>
					<body className={monserrat.className}>{children}</body>
				</html>
			</UserProvider>
		</StoreProvider>
	);
}

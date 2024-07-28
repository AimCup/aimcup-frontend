import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Montserrat } from "@next/font/google";
import { Toaster } from "sonner";
import { OpenAPI, UserService } from "../../generated";
import StoreProvider from "@/lib/Providers/StoreProvider";
import UserProvider from "@/lib/Providers/UserProvider";

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
	let userData = null;
	if (token) {
		OpenAPI.HEADERS = {
			Cookie: `token=${token}`,
		};
		userData = await UserService.me();
	}

	return (
		<StoreProvider>
			<UserProvider userData={userData}>
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
			</UserProvider>
		</StoreProvider>
	);
}

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserService } from "../../generated";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const data = await UserService.me();
	console.log(data);

	return (
		<html
			lang="en"
			className="scroll-smooth bg-primary-dark text-primary-light"
			style={{ scrollBehavior: "smooth" }}
		>
			<body className={inter.className}>{children}</body>
		</html>
	);
}

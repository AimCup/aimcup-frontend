import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "@next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

const monserrat = Montserrat({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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

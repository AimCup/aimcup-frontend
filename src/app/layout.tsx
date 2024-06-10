import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AimCup",
	description: "description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className="bg-primary-dark text-primary-light scroll-smooth"
			style={{ scrollBehavior: "smooth" }}
		>
			<body className={inter.className}>{children}</body>
		</html>
	);
}

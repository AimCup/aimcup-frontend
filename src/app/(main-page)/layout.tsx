import React from "react";
import NextTopLoader from "nextjs-toploader";
import { type INavbarProps, Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";

const navbarProps: INavbarProps[] = [
	{ name: "Home", href: "/" },
	{ name: "Tournaments", href: "/#tournaments" },
	{ name: "About us", href: "/#about" },
	{ name: "Socials", href: "/#socials" },
];

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={navbarProps} />
			<div className={""}>{children}</div>
			<Footer />
		</>
	);
}

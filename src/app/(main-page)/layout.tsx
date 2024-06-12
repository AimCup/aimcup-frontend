import React from "react";
import { Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<div className={""}>{children}</div>
			<Footer />
		</>
	);
}

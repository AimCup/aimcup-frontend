import React from "react";
import { Navbar } from "@ui/organisms/Navbar/Navbar";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<div>{children}</div>
		</>
	);
}

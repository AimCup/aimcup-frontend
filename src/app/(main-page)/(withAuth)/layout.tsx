import React from "react";
import Section from "@ui/atoms/Section/Section";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className={"flex lg:hidden"}>
				Sorry, but this page is not available on mobile devices.
			</div>
			<Section className={"hidden lg:flex"}>{children}</Section>
		</>
	);
}

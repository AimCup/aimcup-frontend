import React from "react";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className={"flex lg:hidden"}>
				Sorry, but this page is not available on mobile devices.
			</div>
			<div className={"hidden lg:flex"}>{children}</div>
		</>
	);
}

import React from "react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<section className={"relative h-72 w-full"}>
				<Image
					src="/placeholder.png"
					alt="aimcup logo"
					className="h-full w-full object-cover"
					layout="fill"
				/>
			</section>
			<div className={""}>{children}</div>
		</>
	);
}

import React from "react";
import NextTopLoader from "nextjs-toploader";
import { Navbar } from "@ui/organisms/Navbar/Navbar";
import { Footer } from "@ui/organisms/Footer/Footer";
import { navigationList } from "@/lib/mainNavigation";
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextTopLoader color="#CA191B" height={5} showSpinner={false} />
			<Navbar routes={navigationList}>
				<LoginAvatar />
			</Navbar>
			{children}
			<Footer />
		</>
	);
}

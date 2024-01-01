import React from "react";
import Image from "next/image";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";

export const Navbar = () => {
	return (
		<>
			<div className={"bg-deepCharcoal flex h-16 w-full items-center justify-between px-28"}>
				<ActiveLink href={"/"}>
					<Image src="/small-logo.svg" alt="Logo" width={30} height={24} />
				</ActiveLink>
				<ActiveLink href={"/#tournaments"}>tournaments</ActiveLink>
				<ActiveLink href={"/#about"}>about</ActiveLink>
				<ActiveLink href={"/#socials"}>socials</ActiveLink>
				<ActiveLink href={"/"}>account</ActiveLink>
			</div>
		</>
	);
};

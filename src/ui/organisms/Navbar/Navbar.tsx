import React from "react";
import Image from "next/image";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";

export const Navbar = () => {
	return (
		<>
			<nav className="md:px-18 flex h-16 w-full items-center justify-between bg-deepCharcoal px-8 lg:px-20">
				<div className="flex-1">
					<a href={"/#"}>
						<Image src="/small-logo.svg" alt="Logo" width={30} height={24} />
					</a>
				</div>
				<div className={"hidden md:flex"}>
					<ul className="menu menu-horizontal gap-2 px-1">
						<li>
							<ActiveLink href={"/"}>Home</ActiveLink>
						</li>
						<li>
							<ActiveLink href={"/#tournaments"}>Tournaments</ActiveLink>
						</li>
						<li>
							<ActiveLink href={"/#about"}>About us</ActiveLink>
						</li>
						<li>
							<ActiveLink href={"/#socials"}>Socials</ActiveLink>
						</li>
					</ul>
				</div>
				<LoginAvatar isLogged={false} />
			</nav>
		</>
	);
};

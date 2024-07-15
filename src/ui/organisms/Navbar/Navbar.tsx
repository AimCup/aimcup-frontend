"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";
import { LoginAvatar } from "@ui/molecules/LoginAvatar/LoginAvatar";

export type INavbarProps = {
	name: string;
	href: string;
	children?: { name: string; href: string }[];
};

export const Navbar = ({ routes }: { routes: INavbarProps[] }) => {
	const dropdownRef = React.useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				dropdownRef.current.removeAttribute("open");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<nav className="md:px-18 flex h-16 w-full items-center justify-between bg-deepCharcoal px-8 lg:px-20">
				<div className="flex-1">
					<Link href={"/"}>
						<Image src="/small-logo.svg" alt="Logo" width={30} height={24} />
					</Link>
				</div>
				<div className={"mr-2 hidden md:flex"}>
					<ul className="menu menu-horizontal z-40 gap-2 px-1">
						{routes.map((item) => {
							if (item.children) {
								return (
									<li key={item.name}>
										<details ref={dropdownRef}>
											<summary>{item.name}</summary>
											<ul>
												{item.children.map((child) => (
													<li key={child.name} className={"w-max"}>
														<ActiveLink href={child.href}>
															{child.name}
														</ActiveLink>
													</li>
												))}
											</ul>
										</details>
									</li>
								);
							}
							return (
								<li key={item.name}>
									<ActiveLink href={item.href}>{item.name}</ActiveLink>
								</li>
							);
						})}
					</ul>
				</div>
				<LoginAvatar />
			</nav>
		</>
	);
};

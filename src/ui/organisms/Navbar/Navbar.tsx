"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";

export type INavbarProps = {
	name: string;
	href: string;
	children?: { name: string; href: string }[];
};

export const Navbar = ({
	children,
	routes,
}: {
	children: React.ReactNode;
	routes: INavbarProps[];
}) => {
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
			<nav className="flex h-16 w-full items-center justify-between bg-deepCharcoal px-4 md:px-6 lg:px-8">
				<div className="flex flex-1 items-center gap-1">
					{/* Mobile burger menu */}
					<div className="dropdown md:hidden">
						<div
							tabIndex={0}
							role="button"
							aria-label="Open navigation menu"
							className="btn btn-ghost btn-sm px-2"
						>
							<FiMenu size={22} />
						</div>
						<ul
							tabIndex={0}
							className="menu dropdown-content z-50 mt-3 w-56 gap-1 rounded-box border border-white/[0.06] bg-deepCharcoal p-2 shadow-lg"
						>
							{routes.map((item) =>
								item.children ? (
									<li key={item.name}>
										<details>
											<summary>{item.name}</summary>
											<ul>
												{item.children.map((child) => (
													<li key={child.name}>
														<Link href={child.href}>{child.name}</Link>
													</li>
												))}
											</ul>
										</details>
									</li>
								) : (
									<li key={item.name}>
										<Link href={item.href}>{item.name}</Link>
									</li>
								),
							)}
						</ul>
					</div>
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
				{children}
			</nav>
		</>
	);
};

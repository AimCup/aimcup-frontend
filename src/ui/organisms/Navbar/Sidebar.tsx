"use client";

import React, { useEffect } from "react";
import { type INavbarProps } from "@ui/organisms/Navbar/Navbar";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";

export const Sidebar = ({ routes }: { routes: INavbarProps[] }) => {
	const dropdownRef = React.useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
				dropdownRef.current.removeAttribute("open");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={"md:flex"}>
			<ul className="menu z-40 gap-2 px-1">
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
	);
};

import React from "react";
import Image from "next/image";
import { ActiveLink } from "@ui/atoms/ActiveLink/ActiveLink";

export const Navbar = () => {
	return (
		<div className="navbar bg-deepCharcoal px-52">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">
					<Image src="/small-logo.svg" alt="Logo" width={30} height={24} />
				</a>
			</div>
			<div className="flex-none gap-10">
				<ul className="menu menu-horizontal gap-10 px-1">
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
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="avatar btn btn-circle btn-ghost">
						<div className="w-10 rounded-full">
							<Image
								alt="Tailwind CSS Navbar component"
								src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							/>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
					>
						<li>
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

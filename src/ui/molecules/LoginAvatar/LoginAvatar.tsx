"use client";

import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { type UserResponseDTO } from "../../../../generated";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Button } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/user/userSlice";
const url = process.env.NEXT_PUBLIC_URL;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const LoginAvatar = () => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	const dispatch = useDispatch();
	console.log("NEXT_PUBLIC_URL", url);
	console.log("NEXT_PUBLIC_API_URL", apiUrl);
	if (!user.id) {
		const redirectUri = encodeURIComponent(
			process.env.NEXT_PUBLIC_URL || "https://next.aimcup.xyz",
		);

		return (
			<Button
				href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`}
			>
				Log in
			</Button>
		);
	}

	return (
		<div className="m dropdown dropdown-end dropdown-hover">
			<Avatar src={`https://a.ppy.sh/${user.osuId}`} notificationCount={0} />
			<ul
				tabIndex={0}
				className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li>
					<Link href={"/account"}>Account</Link>
				</li>
				{/*Only visible for users that are related to the tournament*/}
				<li>
					<Link href={"/dashboard"}>Dashboard</Link>
				</li>
				<li>
					<span
						onClick={() => {
							dispatch(logout());
						}}
					>
						Logout
					</span>
				</li>
			</ul>
		</div>
	);
};

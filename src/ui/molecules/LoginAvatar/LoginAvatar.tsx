"use client";

import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { type UserResponseDTO } from "../../../../generated";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Button } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/user/userSlice";

export const LoginAvatar = () => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	const dispatch = useDispatch();

	if (!user.id) {
		const redirectUri = encodeURIComponent(process.env.URL || "https://next.aimcup.xyz");
		return (
			<Button
				href={`${process.env.API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`}
			>
				Log in to register
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

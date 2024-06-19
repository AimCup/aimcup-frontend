"use client";

import React from "react";
import { type UserResponseDTO } from "../../../../generated";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Button } from "@ui/atoms/Button/Button";
import { useAppSelector } from "@/lib/redux/hooks";

export const LoginAvatar = () => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);

	if (!user.id) {
		const redirectUri = encodeURIComponent(process.env.URL || "https://next.aimcup.xyz");
		return (
			<Button
				href={`${process.env.API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`}
			>
				Log in
			</Button>
		);
	}

	return (
		<div className="m dropdown dropdown-end dropdown-hover">
			<Avatar
				src={`https://a.ppy.sh/${user.osuId}`}
				notificationCount={2}
				className={"ml-2"}
			/>
			<ul
				tabIndex={0}
				className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li>
					<a>Account</a>
				</li>
				<li>
					<a>Logout</a>
				</li>
			</ul>
		</div>
	);
};

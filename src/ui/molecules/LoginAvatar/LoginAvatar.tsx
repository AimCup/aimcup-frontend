import React from "react";
import Link from "next/link";
import { Button } from "@ui/atoms/Button/Button";
import { getUser } from "@/actions/public/getUserAction";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { LogoutButton } from "@ui/atoms/LogoutButton/LogoutButton";

export const LoginAvatar = async () => {
	const userData = await getUser();
	if (!userData?.id) {
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
			<Avatar src={`https://a.ppy.sh/${userData.osuId}`} notificationCount={0} />
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
					<LogoutButton />
				</li>
			</ul>
		</div>
	);
};

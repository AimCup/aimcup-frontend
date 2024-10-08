import React from "react";
import { ImEarth } from "react-icons/im";
import { FaDiscord } from "react-icons/fa";
import { RiBarChartFill } from "react-icons/ri";
import Image from "next/image";
import { cookies } from "next/headers";
import { client } from "../../../../client";
import { getUser } from "@/actions/public/getUserAction";
import { LogoutButton } from "@ui/atoms/LogoutButton/LogoutButton";

export const UserInformation = async () => {
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const userData = await getUser();

	return (
		<div id="user-information" className={"flex w-full flex-col gap-8"}>
			<div className={"flex flex-wrap items-end gap-4"}>
				<h2 className={"text-3xl font-bold"}>Welcome back,</h2>
				<h2 className={"text-3xl font-bold text-deepRed"}>{userData?.username}</h2>
				<span className={"cursor-pointer text-deepRed hover:underline"}>
					<LogoutButton />
				</span>
			</div>
			<div className={"flex flex-wrap items-start gap-8 "}>
				<div
					className={
						"relative flex max-h-[118px] min-h-[118px] min-w-[118px] max-w-[118px] overflow-hidden rounded-md"
					}
				>
					<Image
						src={`https://a.ppy.sh/${userData?.osuId}`}
						alt={userData?.username || "User avatar"}
						fill={true}
					/>
				</div>
				<div className={"flex flex-col gap-4"}>
					<p className={"flex items-center gap-3 text-lg"}>
						<RiBarChartFill className={"text-xl text-deepRed"} /> ---
					</p>
					<p className={"flex items-center gap-3 text-lg"}>
						<ImEarth className={"text-xl text-deepRed"} /> ---
					</p>
					<p className={"flex items-center gap-3 text-lg"}>
						<FaDiscord className={"text-xl text-deepRed"} /> {userData?.discordId}
					</p>
				</div>
			</div>
		</div>
	);
};

import React from "react";
import { ImEarth } from "react-icons/im";
import { FaDiscord } from "react-icons/fa";
import { RiBarChartFill } from "react-icons/ri";
import Image from "next/image";
import Section from "@ui/atoms/Section/Section";
import { getUser } from "@/actions/public/getUserAction";
import { LogoutButton } from "@ui/atoms/LogoutButton/LogoutButton";

export const UserInformation = async () => {
	const userData = await getUser();

	return (
		<Section id="user-information" className={"flex w-full flex-col gap-8"}>
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
						<RiBarChartFill className={"text-xl text-deepRed"} /> TODO
					</p>
					<p className={"flex items-center gap-3 text-lg"}>
						<ImEarth className={"text-xl text-deepRed"} /> TODO
					</p>
					<p className={"flex items-center gap-3 text-lg"}>
						<FaDiscord className={"text-xl text-deepRed"} /> TODO
					</p>
				</div>
			</div>
		</Section>
	);
};

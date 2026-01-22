import React from "react";
import { SiKofi } from "react-icons/si";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SocialItem } from "@ui/atoms/SocialItem/SocialItem";

export const Socials = () => {
	return (
		<section id="socials" className={"flex flex-wrap gap-14"}>
			<SocialItem
				socialItem={{
					name: "Kofi",
					link: "https://ko-fi.com/aimcup",
					icon: <SiKofi size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Twitch",
					link: "https://www.twitch.tv/aimcup",
					icon: <FaTwitch size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Discord",
					link: "https://discord.gg/u2sMXwCtB9",
					icon: <FaDiscord size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Twitter",
					link: "https://twitter.com/aim_cup",
					icon: <FaXTwitter size={"32px"} color={"#151120"} />,
				}}
			/>
		</section>
	);
};

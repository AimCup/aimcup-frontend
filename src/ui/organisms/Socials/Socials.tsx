import React from "react";
import { SiKofi } from "react-icons/si";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SocialItem } from "@ui/atoms/SocialItem";

export const Socials = () => {
	return (
		<section id="socials" className={"flex flex-wrap gap-14"}>
			<SocialItem
				socialItem={{
					name: "Kofi",
					link: "",
					icon: <SiKofi size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Twitch",
					link: "",
					icon: <FaTwitch size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Discord",
					link: "",
					icon: <FaDiscord size={"32px"} color={"#151120"} />,
				}}
			/>
			<SocialItem
				socialItem={{
					name: "Twitter",
					link: "",
					icon: <FaXTwitter size={"32px"} color={"#151120"} />,
				}}
			/>
		</section>
	);
};

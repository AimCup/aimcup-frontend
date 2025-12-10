import React from "react";
import Image from "next/image";
import { SiKofi } from "react-icons/si";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { client, getTournaments } from "../../../../client";

export const Footer = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
	client.setConfig({
		baseUrl: baseUrl,
	});
	const { data } = await getTournaments();

	return (
		<footer className={"md:px-18 md:py-18 px-8 py-10 lg:px-20 lg:py-20"}>
			<div className={"container mx-auto"}>
				<div className={"flex content-center items-center"}>
					<Image
						src={"/aim_logo.svg"}
						alt={"aim-cup-logo"}
						width={80}
						height={80}
						className={"h-[80px] w-[80px]"}
					/>
					<p className={"mx-5 text-3xl font-bold"}>AIM CUP</p>
				</div>
				<div className={"mt-10 flex"}>
					<div className={"mr-10 flex flex-grow flex-col space-y-3"}>
						<p>Home</p>
						<p>Tournaments</p>
						<p>Archive</p>
						<p>About us</p>
						<p>Socials</p>
						<p>My profile</p> {/*TODO: Ukryte gdy użytkownik niezalogowany*/}
					</div>
					<div className={"flex-grow flex-col space-y-3 max-sm:hidden sm:hidden md:flex"}>
						{data?.map((tournament) => (
							<Link
								key={tournament.id}
								href={`/tournament/${tournament.abbreviation?.toLowerCase()}`}
							>
								<p key={tournament.id}>{tournament.name}</p>
							</Link>
						))}
					</div>
					<div className={"flex flex-wrap justify-center gap-14"}>
						<div
							className={
								"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
							}
						>
							<SiKofi size={"32px"} color={"#151120"} />
						</div>
						<div
							className={
								"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
							}
						>
							<FaTwitch size={"32px"} color={"#151120"} />
						</div>

						<div
							className={
								"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
							}
						>
							<FaDiscord size={"32px"} color={"#151120"} />
						</div>
						<div
							className={
								"flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-light transition-opacity hover:opacity-80"
							}
						>
							<FaXTwitter size={"32px"} color={"#151120"} />
						</div>
					</div>
				</div>
				<div className={"flex flex-nowrap content-center items-center py-10"}>
					<p className={"flex-grow text-tuned"}>© Aim Cup 2024</p>
					<div>
						<p className={"text-tuned"}>Designed by</p>
						<p className={"font-bold text-deepRed"}>starlightof</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

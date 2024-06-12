import React from "react";
import Image from "next/image";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";

const SingleTournament = async () => {
	const mappoolSlides = [
		<TournamentCard key={1} date={"05-2025"} status={"Custom"} title={"AimCup 2023"} />,
		<TournamentCard key={2} date={"04-2024"} status={"Custom"} title={"AimCup 2024"} />,
		<TournamentCard key={3} date={"03-2023"} status={"Custom"} title={"AimCup 2023"} />,
		<TournamentCard key={4} date={"02-2022"} status={"Custom"} title={"AimCup 2022"} />,
	];

	return (
		<main className={"text-white"}>
			<section
				id="general-info"
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-full px-8 py-10 lg:px-20 lg:py-20"
				}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
							Welcome to Aim Cup!
						</h2>
						<p className={"text-lg leading-loose sm:pr-8"}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
							est at enim porta luctus. Nunc suscipit volutpat odio ut posuere. Morbi
							nec velit justo. Proin ipsum diam, volutpat sed turpis ac, accumsan
							rhoncus enim. Etiam sollicitudin, lacus at lobortis vestibulum, tortor
							sapien fermentum dolor, vel pharetra massa libero rhoncus lectus.
						</p>
					</div>
					<Image
						src={"/placeholder.png"}
						alt={"welcome"}
						width={350}
						height={350}
						className={" hidden h-[350px] w-[350px] rounded-md object-cover md:block"}
					/>
				</div>
			</section>
			<section
				id="tournaments"
				className={"divide-gray-700 md:px-18 md:py-18 w-full px-8 py-10 lg:px-20 lg:py-20"}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Tournaments!</h2>
						<div className={"flex flex-col gap-10 md:w-full"}>
							{mappoolSlides.map((slide) => slide)}
						</div>
					</div>
				</div>
			</section>
			<section
				id="about"
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-full px-8 py-10 lg:px-20 lg:py-20"
				}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>About us</h2>
						<p className={"text-lg leading-loose sm:pr-8 "}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
							est at enim porta luctus. Nunc suscipit volutpat odio ut posuere. Morbi
							nec velit justo. Proin ipsum diam, volutpat sed turpis ac, accumsan
							rhoncus enim. Etiam sollicitudin, lacus at lobortis vestibulum, tortor
							sapien fermentum dolor, vel pharetra massa libero rhoncus lectus.
						</p>
					</div>
					<Image
						src={"/placeholder.png"}
						alt={"about-us"}
						width={350}
						height={350}
						className={"hidden h-[350px] w-[350px] rounded-md object-cover md:block"}
					/>
				</div>
			</section>
			<section id="socials" className={"flex flex-wrap justify-center gap-14"}>
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
			</section>
		</main>
	);
};

export default SingleTournament;

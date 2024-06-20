import React from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { type EmblaOptionsType } from "embla-carousel";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import { Carousel } from "@ui/organisms/Carousel/Carousel";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";

const OPTIONS: EmblaOptionsType = { loop: false };

const Main = async () => {
	const tournamentSlides = [
		<TournamentCard
			key={1}
			date={"05-2025"}
			status={"Ongoing"}
			title={"AimCup 2023"}
			url={`/tournament/1`}
		/>,
		<TournamentCard
			key={2}
			date={"04-2024"}
			status={"Upcoming"}
			title={"AimCup 2024"}
			url={`/tournament/1`}
		/>,
		<TournamentCard
			key={3}
			date={"03-2023"}
			status={"Finished"}
			title={"AimCup 2023"}
			url={`/tournament/1`}
		/>,
		<TournamentCard
			key={4}
			date={"02-2022"}
			status={"Finished"}
			title={"AimCup 2022"}
			url={`/tournament/1`}
		/>,
	];

	return (
		<main className={"text-white"}>
			<section className={"relative h-[calc(100vh-64px)] w-full"}>
				<Image
					src="/main-page.png"
					alt="aimcup logo"
					className="h-full w-full object-cover"
					fill={true}
				/>
				<div
					className={
						"absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-8 text-center"
					}
				>
					<Image src={"/aim_logo.png"} alt={"logo"} width={300} height={300} />
					<h1 className={"text-5xl font-bold uppercase md:text-6xl lg:text-8xl"}>
						Aim Cup
					</h1>
				</div>

				<Link
					href="/#welcome"
					className="absolute bottom-0 left-1/2 -translate-x-1/2 transform "
				>
					<MdKeyboardArrowDown size={"100px"} className={" animate-bounce"} />
				</Link>
			</section>
			<section
				id="welcome"
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
						<div className={"flex md:hidden"}>
							<Carousel slides={tournamentSlides} options={OPTIONS} />
						</div>
						<div className={"hidden flex-col gap-10 md:flex md:w-full"}>
							{tournamentSlides.map((slide) => slide)}
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

export default Main;

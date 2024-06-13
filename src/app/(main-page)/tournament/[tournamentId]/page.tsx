import React from "react";
import Image from "next/image";
import { FaDiscord, FaTwitch, FaUserAlt, FaPlay } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import { Button } from "@ui/atoms/Button/Button";
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
				id="title"
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-full flex-col gap-4 px-8 py-10 lg:px-20 lg:py-20 "
				}
			>
				<div className={"container flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold leading-relaxed "}>Aim Summer 2023</h2>
						<div className={"flex items-center gap-4 md:justify-start"}>
							<span className={"h-2 w-2 rounded-full bg-deepRed"} />
							<span className={"text-xl text-deepRed md:text-2xl"}>Ongoing</span>
						</div>
					</div>
				</div>
				<div className={"container flex"}>
					<div className={"flex items-center gap-4"}>
						{/* its links btw*/}
						<Button>Register</Button>
						<span className={"text-md text-deepRed"}>Apply for staff</span>
					</div>
				</div>
			</section>
			<section
				id="general-info"
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-1/2 flex-col gap-3 px-8 py-10 md:w-full md:max-w-lg lg:px-20 lg:py-20"
				}
			>
				<div className={"container flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-4xl font-bold leading-relaxed"}>General Info</h2>
					</div>
				</div>
				<div className={"container mx-auto grid  grid-cols-2 grid-rows-2 gap-4"}>
					<span className={"flex items-center gap-2"}>
						<FaUserAlt /> 4v4
					</span>
					<span className={"flex items-center gap-2"}>
						<FaPlay /> Relax
					</span>
					<span className={"flex items-center gap-2"}>
						<IoTime /> 27.07 - 29.07
					</span>
					<span className={"flex items-center gap-2"}>
						<RiBarChartFill /> 10-99k
					</span>
				</div>
			</section>
			<section
				id="Rules"
				className={
					"divide-gray-700 md:px-18 md:py-18 flex w-full flex-col gap-3 px-8 py-10 lg:px-20 lg:py-20"
				}
			>
				<div className={"container flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-4xl font-bold leading-relaxed"}>Rules</h2>
					</div>
				</div>
				<div className={"container"}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque
					consectetur justo ut venenatis. Ut in ultricies lorem, vel blandit ante. Sed
					lacinia lectus mauris, sed venenatis ex sollicitudin at. Cras sagittis sem sit
					amet massa suscipit, non lobortis nisi dignissim. Aenean lacinia pretium diam,
					sit amet sagittis orci maximus id. Nam facilisis eu odio nec accumsan. Nam in
					lobortis metus. Integer rhoncus tempor odio, ut faucibus magna pellentesque
					ullamcorper. Nam dictum purus non sapien lacinia dictum. Suspendisse potenti. Ut
					nec lacinia elit. Donec auctor nibh nibh, eget dapibus nunc aliquet quis.
					Maecenas massa ex, hendrerit non porttitor et, gravida at ligula. In ac dictum
					turpis, vel consectetur lacus. Suspendisse sagittis faucibus quam sed faucibus.
					Donec hendrerit, magna nec mattis porttitor, lectus purus pharetra quam, eu
					imperdiet augue lorem nec leo. Curabitur id ipsum auctor tellus posuere aliquam
					vel aliquet libero. Mauris lacinia pellentesque lacus, vel finibus lacus
					sagittis quis. Sed fermentum elit magna, eget luctus est mattis quis. Nulla
					feugiat blandit ante. Nulla laoreet ipsum quis justo volutpat, eget porta augue
					cursus. Cras dapibus ac turpis quis mollis.
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

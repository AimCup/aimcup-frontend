import React from "react";
import Image from "next/image";
import { FaDiscord, FaTwitch, FaUserAlt, FaPlay } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import type { EmblaOptionsType } from "embla-carousel";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import { Button } from "@ui/atoms/Button/Button";
import { TournamentCard } from "@ui/molecules/Cards/TournamentCard";
import { Carousel } from "@ui/organisms/Carousel/Carousel";

const OPTIONS: EmblaOptionsType = { loop: false };

const SingleTournament = async () => {
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
		<main className={"text-white container mx-auto"}>
			<section
				id="title"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"  flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold leading-relaxed "}>Aim Summer 2023</h2>
						<div className={"flex items-center gap-4 md:justify-start"}>
							<span className={"h-2 w-2 rounded-full bg-deepRed"} />
							<span className={"text-xl text-deepRed md:text-2xl"}>Ongoing</span>
						</div>
					</div>
				</div>
				<div className={" flex"}>
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
					"divide-gray-700 md:px-18  mb-12 flex flex-col gap-3  px-8 md:w-1/2 lg:px-20"
				}
			>
				<div className={"flex"}>
					<div className={"flex items-center gap-4"}>
						<h2 className={"text-4xl font-bold leading-relaxed"}>General Info</h2>
					</div>
				</div>
				<div className={"grid  grid-cols-2 grid-rows-2 gap-4"}>
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
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={"/rules"}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Rules
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<span>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque
						consectetur justo ut venenatis. Ut in ultricies lorem, vel blandit ante. Sed
						lacinia lectus mauris, sed venenatis ex sollicitudin at. Cras sagittis sem
						sit amet massa suscipit, non lobortis nisi dignissim. Aenean lacinia pretium
						diam, sit amet sagittis orci maximus id. Nam facilisis eu odio nec accumsan.
						Nam in lobortis metus. Integer rhoncus tempor odio, ut faucibus magna
						pellentesque ullamcorper. Nam dictum purus non sapien lacinia dictum.
						Suspendisse potenti. Ut nec lacinia elit. Donec auctor nibh nibh, eget
						dapibus nunc aliquet quis. Maecenas massa ex, hendrerit non porttitor et,
						gravida at ligula. In ac dictum turpis, vel consectetur lacus. Suspendisse
						sagittis faucibus quam sed faucibus. Donec hendrerit, magna nec mattis
						porttitor, lectus purus pharetra quam, eu imperdiet augue lorem nec leo.
						Curabitur id ipsum auctor tellus posuere aliquam vel aliquet libero. Mauris
						lacinia pellentesque lacus, vel finibus lacus sagittis quis. Sed fermentum
						elit magna, eget luctus est mattis quis. Nulla feugiat blandit ante. Nulla
						laoreet ipsum quis justo volutpat, eget porta augue cursus. Cras dapibus ac
						turpis quis mollis.
					</span>
					<span className={"hidden md:block"}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque
						consectetur justo ut venenatis. Ut in ultricies lorem, vel blandit ante. Sed
						lacinia lectus mauris, sed venenatis ex sollicitudin at. Cras sagittis sem
						sit amet massa suscipit, non lobortis nisi dignissim. Aenean lacinia pretium
						diam, sit amet sagittis orci maximus id. Nam facilisis eu odio nec accumsan.
						Nam in lobortis metus. Integer rhoncus tempor odio, ut faucibus magna
						pellentesque ullamcorper. Nam dictum purus non sapien lacinia dictum.
						Suspendisse potenti. Ut nec lacinia elit. Donec auctor nibh nibh, eget
						dapibus nunc aliquet quis. Maecenas massa ex, hendrerit non porttitor et,
						gravida at ligula. In ac dictum turpis, vel consectetur lacus. Suspendisse
						sagittis faucibus quam sed faucibus. Donec hendrerit, magna nec mattis
						porttitor, lectus purus pharetra quam, eu imperdiet augue lorem nec leo.
						Curabitur id ipsum auctor tellus posuere aliquam vel aliquet libero. Mauris
						lacinia pellentesque lacus, vel finibus lacus sagittis quis. Sed fermentum
						elit magna, eget luctus est mattis quis. Nulla feugiat blandit ante. Nulla
						laoreet ipsum quis justo volutpat, eget porta augue cursus. Cras dapibus ac
						turpis quis mollis.
					</span>
				</div>
				<Link href={""} className={"inline-block text-deepRed hover:underline"}>
					Read full rules
				</Link>
			</section>
			<section
				id="schedule"
				className={
					"divide-gray-700 md:px-18  mb-12  flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link href={""} className={"group flex cursor-pointer items-center gap-4 "}>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Shedule
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"grid grid-cols-1 gap-10 md:grid-cols-2"}>
					<div className={"flex flex-col gap-4"}>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Registration</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Screening</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Qualifier</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Round of 32</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Round of 16</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Quarter-Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Semi-finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Grand-Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
					</div>
					<div className={"hidden flex-col gap-4 md:flex"}>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Registration</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Screening</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Qualifier</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Round of 32</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Round of 16</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Quarter-Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Semi-finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
						<div className={"flex items-center justify-between gap-4"}>
							<span className={"font-bold"}>Grand-Finals</span>
							<span
								className={
									" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"
								}
							/>
							<span>01.02 - 20.02</span>
						</div>
					</div>
				</div>
				<Link href={""} className={"inline-block text-deepRed hover:underline"}>
					See match schedule
				</Link>
			</section>
			<section
				id="mappool"
				className={"divide-gray-700  md:py-18  md:px-18 w-full px-8 lg:py-20"}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<Link href={""} className={"group flex cursor-pointer items-center gap-4 "}>
							<h2
								className={
									"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
								}
							>
								Mappool
							</h2>{" "}
							<LiaLongArrowAltRightSolid
								size={45}
								className={
									"transition-all group-hover:-rotate-45 group-hover:transform"
								}
							/>
						</Link>
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

export default SingleTournament;

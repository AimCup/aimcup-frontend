import React, { Suspense } from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { TournamentList } from "@ui/organisms/TournamentList/TournamentList";
import { Loading } from "@ui/atoms/Loading/Loading";
import Section from "@ui/atoms/Section/Section";

const Main = async () => {
	return (
		<>
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
			<Section id="welcome">
				<div className={"flex"}>
					<div className={"flex flex-col"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>
							Welcome to Aim Cup!
						</h2>
						<p className={"text-lg leading-loose sm:pr-8"}>
							Welcome to Aim Cup, the biggest osu! Relax tournament since 2021.
							Attracting hundreds of players in each edition, we distinguish ourselves
							by consistently evolving our format and mappool meta. Each iteration
							offers something new and exciting, ensuring a fresh and unique
							experience every time.
						</p>
					</div>
					<Image
						src={"/aim_logo.png"}
						alt={"welcome"}
						width={300}
						height={300}
						className={" hidden object-cover md:block"}
					/>
				</div>
			</Section>
			<Suspense fallback={<Loading size={"md"} />}>
				<Section id="tournaments">
					<div className={"flex flex-col md:w-full"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>Tournaments!</h2>
						<TournamentList />
					</div>
				</Section>
			</Suspense>
			<Section id="about">
				<div className={"flex"}>
					<div className={"flex flex-col"}>
						<h2 className={"mb-3  text-3xl font-bold leading-relaxed"}>About us</h2>
						<p className={"text-lg leading-loose sm:pr-8 "}>
							Aim Cup has been hosted since 2021 by Haruki & Hoaq, focusing on the
							relax mod in osu!. Over time, we&apos;ve expanded beyond just
							tournaments to include interviews, bounties, and even a yearly Top 20
							Player List for the relax scene. Our community has grown significantly
							over the years, and we are proud to be recognized as one of the pillars
							of the relax community.
						</p>
					</div>
				</div>
			</Section>
		</>
	);
};

export default Main;

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
			</Section>
		</>
	);
};

export default Main;

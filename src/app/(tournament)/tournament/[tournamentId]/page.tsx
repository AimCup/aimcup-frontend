import React from "react";
import { FaPlay, FaUserAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { RiBarChartFill } from "react-icons/ri";
import type { EmblaOptionsType } from "embla-carousel";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Link from "next/link";
import { Button } from "@ui/atoms/Button/Button";
import { Carousel } from "@ui/organisms/Carousel/Carousel";
import { TeamCard } from "@ui/molecules/Cards/TeamCard";
import { generateTeam, generateUsers, mappoolSlicesMock } from "@/mocks/mockups";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Socials } from "@ui/organisms/Socials/Socials";

const OPTIONS: EmblaOptionsType = { loop: false };

const SingleTournament = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="title"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold leading-relaxed "}>Aim Summer 2023</h2>
						<div className={"flex items-center gap-4 md:justify-start"}>
							<span className={"h-2 w-2 rounded-full bg-deepRed"} />
							<span className={"text-xl text-flatRed md:text-2xl"}>Ongoing</span>
						</div>
					</div>
				</div>
				<div className={" flex"}>
					<div className={"flex items-center gap-4"}>
						{/* its links btw*/}
						<Button>Register</Button>
						<span className={"text-md text-flatRed"}>Apply for staff</span>
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
				id="rules"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
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
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/rules`}
						className={"text-flatRed hover:underline"}
					>
						Read full rules
					</Link>
				</div>
			</section>
			<section
				id="schedule"
				className={
					"divide-gray-700 md:px-18  mb-12  flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/schedule`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
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
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/shedule`}
						className={"text-flatRed hover:underline"}
					>
						See match schedule
					</Link>
				</div>
			</section>
			<section
				id="mappool"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"container mx-auto flex"}>
					<div className={"flex flex-col md:w-full"}>
						<Link
							href={`${params.tournamentId}/mappool`}
							className={"group mb-4 flex cursor-pointer items-center gap-4 "}
						>
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
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
							<Carousel slides={mappoolSlicesMock} options={OPTIONS} />
						</div>
						<div className={"hidden flex-col gap-10 md:flex md:w-full"}>
							{/* eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */}
							{mappoolSlicesMock.map((slide) => slide)}
						</div>
					</div>
				</div>
			</section>

			<section
				id="teams"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/teams`}
						className={"group flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Teams
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
					<div>
						<TeamCard team={generateTeam()} />
					</div>
					<div className={"hidden md:flex"}>
						<TeamCard team={generateTeam()} />
					</div>
				</div>
			</section>

			<section
				id="prizes"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<h2 className={"text-4xl font-bold leading-relaxed"}>Prizes</h2>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>1st place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>2nd place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
				<div
					className={"flex items-center justify-between gap-4 md:w-1/2 lg:w-1/3 xl:w-1/4"}
				>
					<span className={"font-bold"}>3rd place</span>
					<span
						className={" h-4 flex-1 border-b-2 border-dotted border-deepRed opacity-30"}
					/>
					<span>$150</span>
				</div>
			</section>

			<section
				id="staff"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<Link
						href={`${params.tournamentId}/staff`}
						className={"group mb-4 flex cursor-pointer items-center gap-4 "}
					>
						<h2
							className={
								"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
							}
						>
							Staff
						</h2>{" "}
						<LiaLongArrowAltRightSolid
							size={45}
							className={
								"transition-all group-hover:-rotate-45 group-hover:transform"
							}
						/>
					</Link>
				</div>
				<div className={"mc:w-3/5 grid grid-cols-2 gap-4"}>
					{generateUsers(8)?.map((staff) => (
						<div key={staff.id} className={"flex items-center gap-4"}>
							<div className={"relative"}>
								<Avatar src={`https://a.ppy.sh/${staff?.osuId}`} />
							</div>

							<span className={"overflow-hidden truncate"}>{staff?.username}</span>
						</div>
					))}
				</div>
			</section>

			<section
				id="staff"
				className={
					"divide-gray-700   md:px-18 mb-12 flex w-full flex-col gap-3 px-8 lg:px-20"
				}
			>
				<div className={"flex"}>
					<h2
						className={
							"text-4xl font-bold leading-relaxed transition-all group-hover:underline"
						}
					>
						Links
					</h2>
				</div>
				<Socials />
			</section>
		</main>
	);
};

export default SingleTournament;

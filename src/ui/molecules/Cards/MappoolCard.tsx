import React from "react";
import Image from "next/image";
import { IoTime } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { PiMetronomeFill } from "react-icons/pi";
import { type BeatmapModificationResponseDto } from "../../../../client";
import { TextBox } from "@ui/atoms/TextBox/TextBox";

export const MappoolCard = ({
	title,
	modification,
	isCustom,
	img,
	author,
	mapInformation,
	position,
}: {
	title?: string;
	modification?: BeatmapModificationResponseDto["modification"];
	isCustom: boolean;
	img?: string;
	author?: string;
	position: number;
	mapInformation: {
		stars: number;
		time: number;
		bpm: number;
		ar: number;
		hp: number;
		od: number;
		cs: number;
	};
}) => {
	return (
		<div className="group grid h-96 overflow-hidden rounded-md border border-solid border-transparent bg-tuned transition-all md:rounded-2xl">
			<div className={"relative h-96 overflow-hidden"}>
				<Image
					className="embla__slide__img h-1/2 w-full rounded-t-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 md:hidden"
					src={img || `/placeholder.png`}
					alt="mappool-card"
					width={350}
					height={384}
				/>
				<div
					className={
						"absolute bottom-0 left-0 right-0 top-0 z-10 hidden bg-tuned opacity-30 md:flex md:rounded-2xl"
					}
				></div>
				<Image
					className="embla__slide__img hidden h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 md:flex md:rounded-2xl"
					src={img || `/placeholder.png`}
					alt="mappool-card"
					fill={true}
				/>
				{isCustom && (
					<div className="absolute left-2 top-2 z-20 md:left-6 md:top-6">
						<TextBox size={"sm"}>Custom</TextBox>
					</div>
				)}

				<div
					className={
						"absolute -left-0.5 bottom-6 z-20 hidden flex-col text-2xl md:flex md:w-4/5 md:min-w-max lg:w-3/5 lg:min-w-max"
					}
				>
					<div className={"flex gap-5 pl-8 text-base"}>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<IoIosStar />
							</span>
							<span className={"text-white"}>
								{mapInformation?.stars?.toFixed(2)}
							</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<IoTime />
							</span>
							<span className={"text-white"}>{mapInformation?.time}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<PiMetronomeFill />
							</span>
							<span className={"text-white"}>{mapInformation?.bpm?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>AR</span>
							<span className={"text-white"}>{mapInformation?.ar?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>HP</span>
							<span className={"text-white"}>{mapInformation?.hp?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>OD</span>
							<span className={"text-white"}>{mapInformation?.od?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>CS</span>
							<span className={"text-white"}>{mapInformation?.cs?.toFixed(0)}</span>
						</div>
					</div>
					<TextBox>
						<div className={"flex w-full items-center gap-5 pl-8"}>
							<span>{title}</span>
							{modification && (
								<span
									className={"rounded-md bg-primary-light px-2 py-3 text-deepRed"}
								>
									{modification}
									{modification !== "TB" && position}
								</span>
							)}
							<span className={"ml-auto text-xl font-normal opacity-70"}>
								by {author}
							</span>
						</div>
					</TextBox>
				</div>
				<div
					className={
						"bg-black absolute bottom-0 flex h-1/2 w-full flex-col justify-between p-5 md:hidden"
					}
				>
					<div className={"mb-2 flex flex-col gap-2"}>
						<h3 className={"text-white truncate text-2xl font-bold"}>{title}</h3>
						<span className={"flex items-center gap-2 truncate opacity-70"}>
							by {author}
						</span>
					</div>
					<div className={"grid grid-flow-col grid-cols-3 grid-rows-3 gap-2"}>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<IoIosStar />
							</span>
							<span className={"text-white"}>
								{mapInformation?.stars?.toFixed(2)}
							</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<IoTime />
							</span>
							<span className={"text-white"}>{mapInformation?.time}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>
								<PiMetronomeFill />
							</span>
							<span className={"text-white"}>{mapInformation?.bpm?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>AR</span>
							<span className={"text-white"}>{mapInformation?.ar?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>HP</span>
							<span className={"text-white"}>{mapInformation?.hp?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>OD</span>
							<span className={"text-white"}>{mapInformation?.od?.toFixed(0)}</span>
						</div>
						<div className={"flex items-center gap-2"}>
							<span className={"text-white"}>CS</span>
							<span className={"text-white"}>{mapInformation?.cs?.toFixed(0)}</span>
						</div>
					</div>
					{modification && (
						<div
							className={
								"absolute bottom-3 right-3 flex items-center justify-center rounded-md bg-deepRed p-2 font-bold text-primary md:hidden"
							}
						>
							{modification}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

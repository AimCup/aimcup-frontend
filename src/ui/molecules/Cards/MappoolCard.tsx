import React from "react";
import Image from "next/image";
import { IoTime } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { PiMetronomeFill } from "react-icons/pi";
import { type BeatmapModificationResponseDto } from "../../../../client";
import { TextBox } from "@ui/atoms/TextBox/TextBox";

export const MappoolCard = ({
	title,
	version,
	modification,
	isCustom,
	img,
	author,
	mapInformation,
	position,
	href,
}: {
	href: string;
	title?: string;
	version?: string;
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
		<a href={href} target={"_blank"}>
			<div className="group grid h-96 overflow-hidden rounded-md border border-solid border-transparent bg-tuned transition-all md:rounded-2xl">
				<div className={"relative h-96 overflow-hidden"}>
					<Image
						className="embla__slide__img h-1/3 w-full rounded-t-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
						src={img || `/placeholder.png`}
						alt="mappool-card"
						width={350}
						height={384}
					/>
					{isCustom && (
						<div className="absolute left-2 top-2 z-20 md:left-6 md:top-6">
							<TextBox size={"sm"}>Custom</TextBox>
						</div>
					)}
					<div
						className={
							"bg-black absolute bottom-0 flex h-2/3 w-full flex-col justify-between p-5"
						}
					>
						<div className={"mb-2 flex flex-col gap-2"}>
							<h3 className={"text-white truncate text-2xl font-bold"}>{title}</h3>
							<span className={"flex items-center gap-2 truncate opacity-70"}>
								[{version}]
							</span>
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
								<span className={"text-white"}>
									{mapInformation?.bpm?.toFixed(0)}
								</span>
							</div>
							<div className={"flex items-center gap-2"}>
								<span className={"text-white"}>AR</span>
								<span className={"text-white"}>
									{mapInformation?.ar?.toFixed(0)}
								</span>
							</div>
							<div className={"flex items-center gap-2"}>
								<span className={"text-white"}>HP</span>
								<span className={"text-white"}>
									{mapInformation?.hp?.toFixed(0)}
								</span>
							</div>
							<div className={"flex items-center gap-2"}>
								<span className={"text-white"}>OD</span>
								<span className={"text-white"}>
									{mapInformation?.od?.toFixed(0)}
								</span>
							</div>
							<div className={"flex items-center gap-2"}>
								<span className={"text-white"}>CS</span>
								<span className={"text-white"}>
									{mapInformation?.cs?.toFixed(0)}
								</span>
							</div>
						</div>
						{modification && (
							<div
								className={
									"absolute bottom-3 right-3 flex items-center justify-center rounded-md bg-deepRed p-2 font-bold text-primary"
								}
							>
								{modification}
								{modification !== "TB" && position}
							</div>
						)}
					</div>
				</div>
			</div>
		</a>
	);
};

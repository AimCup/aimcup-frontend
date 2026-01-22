"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type BeatmapModificationResponseDto } from "../../../../client";

interface BeatmapListItemProps {
	href: string;
	title: string;
	artist: string;
	version: string;
	creator: string;
	modification?: BeatmapModificationResponseDto["modification"];
	position: number;
	isCustom: boolean;
	img?: string;
	mapInformation: {
		stars: number;
		time: number;
		bpm: number;
		ar: number;
		hp: number;
		od: number;
		cs: number;
	};
	_tournamentAbbreviation: string;
	_beatmapId: number;
	_beatmapsetId: number;
}

export const BeatmapListItem = ({
	href,
	title,
	artist,
	version,
	creator,
	modification,
	position,
	isCustom,
	img,
	mapInformation,
}: BeatmapListItemProps) => {
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
		return `${minutes}:${formattedSeconds}`;
	};

	const getModificationColor = (mod?: string) => {
		switch (mod) {
			case "NM":
				return "bg-blue-600";
			case "HD":
				return "bg-yellow-500";
			case "HR":
				return "bg-orange-500";
			case "DT":
				return "bg-purple-500";
			case "FM":
				return "bg-pink-500";
			case "TB":
				return "bg-red-500";
			default:
				return "bg-gray-600";
		}
	};

	const getModificationLabel = (mod?: string, pos?: number) => {
		if (!mod) return "";
		if (mod === "TB") return "TB";
		return `${mod}${pos || ""}`;
	};

	const getModificationGradient = (mod?: string) => {
		switch (mod) {
			case "NM":
				return "transparent";
			case "DT":
				return "linear-gradient(to right, rgba(75, 0, 130, 0.3), rgba(75, 0, 130, 0.1), transparent)";
			case "HD":
				return "linear-gradient(to right, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1), transparent)";
			case "HR":
				return "linear-gradient(to right, rgba(220, 20, 60, 0.3), rgba(220, 20, 60, 0.1), transparent)";
			case "TB":
				return "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), transparent)";
			case "FM":
				return "linear-gradient(to right, rgba(0, 255, 255, 0.3), rgba(0, 255, 255, 0.1), transparent)";
			case "FL":
				return "linear-gradient(to right, rgba(128, 128, 128, 0.3), rgba(128, 128, 128, 0.1), transparent)";
			case "EZ":
				return "linear-gradient(to right, rgba(0, 128, 0, 0.3), rgba(0, 128, 0, 0.1), transparent)";
			case "HT":
				return "linear-gradient(to right, rgba(255, 140, 0, 0.3), rgba(255, 140, 0, 0.1), transparent)";
			default:
				return "transparent";
		}
	};

	return (
		<div className="group relative flex w-full overflow-hidden rounded-lg bg-gray-700/80 backdrop-blur-sm shadow-md transition-all hover:shadow-lg hover:bg-gray-700/90">
			{/* Gradient overlay based on modification - starts from right edge of image */}
			<div
				className="absolute top-0 bottom-0 pointer-events-none z-10"
				style={{
					left: "256px", // Start from right edge of image (w-64 = 256px)
					right: "0",
					background: getModificationGradient(modification),
				}}
			/>
			<Link
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="absolute inset-0 z-0"
			/>
			{/* Left section with background image */}
			<Link
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={(e) => e.stopPropagation()}
				className="relative flex-shrink-0 w-64 overflow-hidden rounded-l-lg"
			>
				<Image
					src={img || "/placeholder.png"}
					alt={title}
					fill
					className="object-cover brightness-70 group-hover:brightness-85 transition-all"
				/>
			</Link>

			{/* Center section with song info */}
			<div className="flex-1 flex flex-col justify-center px-6 py-4 min-w-0 relative z-0">
				<h3 className="text-white font-semibold text-lg truncate mb-0.5 relative z-10" title={title}>
					{title}
				</h3>
				<p className="text-gray-400 text-xs truncate mb-1 relative z-10" title={`[${version}]`}>
					[{version}]
				</p>
				<p className="text-gray-300 text-sm truncate mb-1 relative z-10" title={artist}>
					{artist}
				</p>
				<p className="text-gray-400 text-xs truncate relative z-10" title={`Mapped by ${creator}`}>
					Mapped by <span className="text-gray-300">{creator}</span>
				</p>
			</div>

			{/* Custom beatmap logo background - between title and modification badge */}
			{isCustom && (
				<div
					className="absolute top-1/2 -translate-y-1/2 opacity-15 pointer-events-none bg-contain bg-no-repeat z-10"
					style={{
						backgroundImage: "url('/aim_logo.svg')",
						backgroundPosition: "center",
						backgroundSize: "180px",
						left: "calc(256px + 40%)", // Position between image and modification badge
						width: "180px",
						height: "180px",
					}}
				/>
			)}

			{/* Right section with map details */}
			<div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 relative z-0">
				{/* Modification badge */}
				{modification && (
					<div
						className={`${getModificationColor(modification)} text-white font-bold px-3 py-1.5 rounded text-sm whitespace-nowrap min-w-[50px] text-center shadow-md`}
					>
						{getModificationLabel(modification, modification !== "TB" ? position : undefined)}
					</div>
				)}

				{/* Difficulty info */}
				<div className="flex items-center gap-3">
					{/* Star rating */}
					<div className="text-white font-semibold text-sm whitespace-nowrap" title={`${mapInformation.stars.toFixed(1)}★`}>
						{mapInformation.stars.toFixed(1)}★
					</div>
					{/* Matryca 3x2 */}
					<div className="grid grid-cols-3 grid-rows-2 gap-1.5">
						{/* Kolumna 1: length nad BPM */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={formatTime(mapInformation.time)}>
							{formatTime(mapInformation.time)}
						</span>
						{/* Kolumna 2: AR nad HP */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={`AR ${mapInformation.ar.toFixed(1)}`}>
							AR {mapInformation.ar.toFixed(1)}
						</span>
						{/* Kolumna 3: CS nad OD */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={`CS ${mapInformation.cs.toFixed(1)}`}>
							CS {mapInformation.cs.toFixed(1)}
						</span>
						{/* Kolumna 1, wiersz 2: BPM pod length */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={`${mapInformation.bpm.toFixed(0)} bpm`}>
							{mapInformation.bpm.toFixed(0)} bpm
						</span>
						{/* Kolumna 2, wiersz 2: HP pod AR */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={`HP ${mapInformation.hp.toFixed(1)}`}>
							HP {mapInformation.hp.toFixed(1)}
						</span>
						{/* Kolumna 3, wiersz 2: OD pod CS */}
						<span className="bg-gray-700/90 text-gray-200 text-xs px-2.5 py-1 rounded-md truncate" title={`OD ${mapInformation.od.toFixed(1)}`}>
							OD {mapInformation.od.toFixed(1)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};


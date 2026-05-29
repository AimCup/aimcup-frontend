"use client";

import React, { useMemo, useState } from "react";
import { type CustomBeatmapResponseDto } from "../../../../client";
import { BeatmapListItem } from "@ui/molecules/BeatmapListItem/BeatmapListItem";

const MODS = ["NM", "HD", "HR", "DT", "FM", "TB"] as const;

const MOD_COLORS_ACTIVE: Record<string, string> = {
	NM: "bg-blue-600",
	HD: "bg-yellow-500",
	HR: "bg-orange-500",
	DT: "bg-purple-500",
	FM: "bg-pink-500",
	TB: "bg-red-500",
};

interface CustomMapsClientProps {
	maps: CustomBeatmapResponseDto[];
}

export const CustomMapsClient = ({ maps }: CustomMapsClientProps) => {
	const [search, setSearch] = useState("");
	const [selectedEditions, setSelectedEditions] = useState<Set<string>>(new Set());
	const [selectedMods, setSelectedMods] = useState<Set<string>>(new Set());
	const [customSongOnly, setCustomSongOnly] = useState(false);
	const [starSort, setStarSort] = useState<"asc" | "desc" | null>(null);

	const editions = useMemo(() => {
		const names = maps.map((m) => m.tournamentName);
		return Array.from(new Set(names)).sort();
	}, [maps]);

	const toggleEdition = (name: string) => {
		setSelectedEditions((prev) => {
			const next = new Set(prev);
			next.has(name) ? next.delete(name) : next.add(name);
			return next;
		});
	};

	const toggleMod = (mod: string) => {
		setSelectedMods((prev) => {
			const next = new Set(prev);
			next.has(mod) ? next.delete(mod) : next.add(mod);
			return next;
		});
	};

	const cycleStarSort = () => {
		setStarSort((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
	};

	const filtered = useMemo(() => {
		let result = maps;

		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter(
				(m) =>
					m.title.toLowerCase().includes(q) ||
					m.artist.toLowerCase().includes(q) ||
					m.creator.toLowerCase().includes(q),
			);
		}

		if (selectedEditions.size > 0) {
			result = result.filter((m) => selectedEditions.has(m.tournamentName));
		}

		if (selectedMods.size > 0) {
			result = result.filter((m) => m.modification && selectedMods.has(m.modification));
		}

		if (customSongOnly) {
			result = result.filter((m) => m.isCustomSong);
		}

		if (starSort !== null) {
			result = [...result].sort((a, b) => {
				const aStars = a.beatmapStatistics?.starRating ?? 0;
				const bStars = b.beatmapStatistics?.starRating ?? 0;
				return starSort === "desc" ? bStars - aStars : aStars - bStars;
			});
		}

		return result;
	}, [maps, search, selectedEditions, selectedMods, customSongOnly, starSort]);

	return (
		<div className="flex flex-col gap-6">
			{/* Filters */}
			<div className="flex flex-col gap-4 rounded-lg bg-gray-800/50 p-4">
				{/* Search */}
				<input
					type="text"
					placeholder="Search by title, artist or mapper..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="input input-bordered w-full focus:border-mintGreen focus:ring-mintGreen"
				/>

				<div className="flex flex-wrap items-center gap-4">
					{/* Edition filter */}
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-400">Edition:</span>
						{editions.map((name) => (
							<button
								key={name}
								onClick={() => toggleEdition(name)}
								className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
									selectedEditions.has(name)
										? "bg-mintGreen text-black"
										: "bg-gray-700 text-gray-300 hover:bg-gray-600"
								}`}
							>
								{name}
							</button>
						))}
					</div>

					{/* Mod filter */}
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-400">Mod:</span>
						{MODS.map((mod) => (
							<button
								key={mod}
								onClick={() => toggleMod(mod)}
								className={`rounded px-3 py-1 text-sm font-bold text-white transition-opacity ${
									selectedMods.size === 0 || selectedMods.has(mod)
										? MOD_COLORS_ACTIVE[mod]
										: "bg-gray-600 opacity-40"
								}`}
							>
								{mod}
							</button>
						))}
					</div>

					{/* Custom song filter */}
					<button
						onClick={() => setCustomSongOnly((v) => !v)}
						className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
							customSongOnly
								? "bg-mintGreen text-black"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						}`}
					>
						🎵 Original only
					</button>

					{/* Star sort */}
					<button
						onClick={cycleStarSort}
						className={`ml-auto rounded px-3 py-1 text-sm font-medium transition-colors ${
							starSort !== null
								? "bg-mintGreen text-black"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						}`}
					>
						{starSort === "desc" ? "★ High → Low" : starSort === "asc" ? "★ Low → High" : "★ Sort"}
					</button>
				</div>
			</div>

			{/* Results count */}
			<p className="text-sm text-gray-400">
				{filtered.length} {filtered.length === 1 ? "map" : "maps"}
			</p>

			{/* Map list */}
			<div className="flex flex-col gap-3">
				{filtered.map((map) => (
					<BeatmapListItem
						key={map.id}
						href={`https://osu.ppy.sh/beatmapsets/${map.beatmapsetId}#osu/${map.beatmapId}`}
						title={map.title}
						artist={map.artist}
						version={map.version}
						creator={map.creator}
						modification={map.modification}
						position={map.position}
						isCustom={map.isCustom}
						isCustomSong={map.isCustomSong}
						playCount={map.playCount}
						img={map.normalCover}
						mapInformation={{
							stars: map.beatmapStatistics.starRating,
							time: map.beatmapStatistics.length,
							bpm: map.beatmapStatistics.bpm,
							ar: map.beatmapStatistics.ar,
							hp: map.beatmapStatistics.hp,
							od: map.beatmapStatistics.od,
							cs: map.beatmapStatistics.cs,
						}}
						_tournamentAbbreviation={map.tournamentAbbreviation}
						_beatmapId={map.beatmapId}
						_beatmapsetId={map.beatmapsetId}
					/>
				))}
				{filtered.length === 0 && (
					<p className="py-12 text-center text-gray-500">No maps match your filters.</p>
				)}
			</div>
		</div>
	);
};

"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { modification, type CustomBeatmapResponseDto } from "../../../../../../client";
import { addCustomMapAction, deleteCustomMapAction } from "@/actions/admin/adminCustomMapActions";
import { Button } from "@ui/atoms/Button/Button";
import { Input } from "@ui/atoms/Forms/Input/Input";

const MOD_OPTIONS = [
	{ value: modification.NM, label: "NM" },
	{ value: modification.HD, label: "HD" },
	{ value: modification.HR, label: "HR" },
	{ value: modification.DT, label: "DT" },
	{ value: modification.FM, label: "FM" },
	{ value: modification.TB, label: "TB" },
];

const MOD_COLORS: Record<string, string> = {
	NM: "bg-blue-600",
	HD: "bg-yellow-500",
	HR: "bg-orange-500",
	DT: "bg-purple-500",
	FM: "bg-pink-500",
	TB: "bg-red-500",
};

interface CustomMapsAdminProps {
	maps: CustomBeatmapResponseDto[];
}

export const CustomMapsAdmin = ({ maps: initialMaps }: CustomMapsAdminProps) => {
	const [maps, setMaps] = useState(initialMaps);
	const [url, setUrl] = useState("");
	const [mod, setMod] = useState<string>(modification.NM);
	const [editionName, setEditionName] = useState("");
	const [position, setPosition] = useState("1");
	const [loading, setLoading] = useState(false);

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await addCustomMapAction(
				url,
				mod as typeof modification.NM,
				editionName,
				parseInt(position),
			);
			if (!result.status) {
				toast.error(result.errorMessage);
				return;
			}
			setMaps((prev) => [...prev, result.data]);
			setUrl("");
			setPosition("1");
			toast.success(`${result.data.title} added.`);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, title: string) => {
		const result = await deleteCustomMapAction(id);
		if (!result.status) {
			toast.error(result.errorMessage);
			return;
		}
		setMaps((prev) => prev.filter((m) => m.id !== id));
		toast.success(`${title} removed.`);
	};

	return (
		<div className="flex flex-col gap-8">
			{/* Add form */}
			<form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-lg bg-gray-800/50 p-6">
				<h2 className="text-lg font-semibold">Add custom map</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Input
						name="url"
						label="Beatmap URL"
						placeholder="https://osu.ppy.sh/beatmapsets/123#osu/456"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						required
					/>
					<Input
						name="editionName"
						label="Edition name"
						placeholder="Aim Cup 1"
						value={editionName}
						onChange={(e) => setEditionName(e.target.value)}
						required
					/>
					<div className="flex flex-col gap-1">
						<label className="label">
							<span className="label-text capitalize">Modification :</span>
						</label>
						<div className="flex flex-wrap gap-2">
							{MOD_OPTIONS.map((o) => (
								<button
									key={o.value}
									type="button"
									onClick={() => setMod(o.value)}
									className={`rounded px-3 py-1.5 text-sm font-bold text-white transition-opacity ${
										mod === o.value ? MOD_COLORS[o.label] : "bg-gray-600 opacity-50"
									}`}
								>
									{o.label}
								</button>
							))}
						</div>
					</div>
					<Input
						name="position"
						label="Position"
						type="number"
						value={position}
						onChange={(e) => setPosition(e.target.value)}
						required
					/>
				</div>
				<Button type="submit" className="w-max" disabled={loading}>
					{loading ? "Adding..." : "Add map"}
				</Button>
			</form>

			{/* Map list */}
			<div className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">
					Standalone custom maps ({maps.length})
				</h2>
				{maps.length === 0 && (
					<p className="text-gray-500">No standalone custom maps yet.</p>
				)}
				{maps.map((map) => (
					<div
						key={map.id}
						className="flex items-center justify-between rounded-lg bg-gray-800/50 px-4 py-3"
					>
						<div className="flex items-center gap-4 min-w-0">
							<span
								className={`shrink-0 rounded px-2 py-1 text-xs font-bold text-white ${MOD_COLORS[map.modification ?? ""] ?? "bg-gray-600"}`}
							>
								{map.modification}
							</span>
							<div className="min-w-0">
								<p className="truncate font-medium">{map.title}</p>
								<p className="truncate text-sm text-gray-400">
									{map.artist} — {map.tournamentName}
								</p>
							</div>
						</div>
						<button
							onClick={() => handleDelete(map.id, map.title)}
							className="ml-4 shrink-0 text-sm text-red-400 hover:text-red-300"
						>
							Remove
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

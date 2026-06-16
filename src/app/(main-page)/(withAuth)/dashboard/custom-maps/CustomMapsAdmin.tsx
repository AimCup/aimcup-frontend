"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { modification, type CustomBeatmapResponseDto } from "../../../../../../client";
import {
	addCustomMapAction,
	deleteCustomMapAction,
	refreshPlayCountsAction,
	updateCustomMapAction,
	toggleMappoolBeatmapCustomSongAction,
} from "@/actions/admin/adminCustomMapActions";
import { Button } from "@ui/atoms/Button/Button";
import { Input } from "@ui/atoms/Forms/Input/Input";
import { Card } from "@ui/atoms/Card/Card";

function Spinner() {
	return <span className="loading loading-spinner loading-xs" />;
}

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

const STAGE_LABELS: Record<string, string> = {
	REGISTRATION: "Registration",
	SCREENING: "Screening",
	QUALIFICATION: "Qualifiers",
	SWISS_1: "Swiss 1", SWISS_2: "Swiss 2", SWISS_3: "Swiss 3",
	SWISS_4: "Swiss 4", SWISS_5: "Swiss 5", SWISS_6: "Swiss 6",
	RO128: "Round of 128", RO64: "Round of 64", RO32: "Round of 32", RO16: "Round of 16",
	QUARTER_FINAL: "Quarterfinals",
	SEMI_FINAL: "Semifinals",
	FINAL: "Finals",
	GRAND_FINAL: "Grand Finals",
};

// ─── Toggle button (per-row loader for mappool toggle) ────────────────────────

function ToggleCustomSongButton({
	map,
	onToggled,
}: {
	map: CustomBeatmapResponseDto;
	onToggled: (updated: CustomBeatmapResponseDto) => void;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		startTransition(async () => {
			const result = await toggleMappoolBeatmapCustomSongAction(map.id, !(map.isCustomSong ?? false));
			if (!result.status) {
				toast.error(result.errorMessage, { duration: 4000 });
				return;
			}
			onToggled(result.data);
			toast.success(
				result.data.isCustomSong
					? `${result.data.title} marked as original.`
					: `${result.data.title} unmarked as original.`,
				{ duration: 2500 },
			);
		});
	};

	return (
		<button
			onClick={handle}
			disabled={isPending}
			className={`ml-3 shrink-0 flex items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
				map.isCustomSong
					? "bg-mintGreen text-black hover:bg-mintGreen/80"
					: "bg-gray-700 text-gray-300 hover:bg-gray-600"
			}`}
		>
			{isPending && <Spinner />}
			{map.isCustomSong ? "Original ✓" : "Mark as Original"}
		</button>
	);
}

// ─── Delete button (per-row loader for standalone maps) ───────────────────────

function DeleteMapButton({
	map,
	onDeleted,
}: {
	map: CustomBeatmapResponseDto;
	onDeleted: (id: string) => void;
}) {
	const [isPending, startTransition] = useTransition();

	const handle = () => {
		if (!confirm(`Remove "${map.title}"? This cannot be undone.`)) return;
		startTransition(async () => {
			const result = await deleteCustomMapAction(map.id);
			if (!result.status) {
				toast.error(result.errorMessage, { duration: 4000 });
				return;
			}
			onDeleted(map.id);
			toast.success(`${map.title} removed.`, { duration: 2500 });
		});
	};

	return (
		<button
			onClick={handle}
			disabled={isPending}
			className="flex items-center gap-1 text-xs text-flatRed hover:text-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
		>
			{isPending && <Spinner />}
			Remove
		</button>
	);
}

// ─── Mappool section ──────────────────────────────────────────────────────────

interface MappoolMapsSectionProps {
	maps: CustomBeatmapResponseDto[];
	onToggled: (updated: CustomBeatmapResponseDto) => void;
}

const MappoolMapsSection = ({ maps, onToggled }: MappoolMapsSectionProps) => {
	const [openTournaments, setOpenTournaments] = useState<Set<string>>(new Set());
	const [openStages, setOpenStages] = useState<Set<string>>(new Set());

	const byTournament: Record<string, Record<string, CustomBeatmapResponseDto[]>> = {};
	for (const map of maps) {
		const t = map.tournamentName;
		const s = map.stageName ?? "Unknown Stage";
		if (!byTournament[t]) byTournament[t] = {};
		if (!byTournament[t][s]) byTournament[t][s] = [];
		byTournament[t][s].push(map);
	}

	const toggleTournament = (name: string) =>
		setOpenTournaments((prev) => {
			const next = new Set(prev);
			next.has(name) ? next.delete(name) : next.add(name);
			return next;
		});

	const toggleStage = (key: string) =>
		setOpenStages((prev) => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});

	return (
		<Card
			title="Mappool custom maps"
			headerAction={
				<p className="text-sm text-white/40">
					Maps from released pools. Expand a tournament and stage to toggle original song status.
				</p>
			}
		>
			{maps.length === 0 ? (
				<p className="py-6 text-center text-white/40">No mappool custom maps found.</p>
			) : (
				<div className="flex flex-col gap-3">
					{Object.entries(byTournament).map(([tournamentName, stages]) => {
						const isTOpen = openTournaments.has(tournamentName);
						const totalOriginals = Object.values(stages).flat().filter((m) => m.isCustomSong).length;
						const totalMaps = Object.values(stages).flat().length;
						return (
							<div key={tournamentName} className="rounded-lg border border-white/5 bg-deepCharcoal/60 overflow-hidden">
								<button
									type="button"
									onClick={() => toggleTournament(tournamentName)}
									className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
								>
									<div className="flex items-center gap-3">
										<span className="font-semibold text-white">{tournamentName}</span>
										<span className="text-xs text-white/40">{totalMaps} maps</span>
										{totalOriginals > 0 && (
											<span className="rounded bg-mintGreen px-1.5 py-0.5 text-xs font-bold text-black">
												{totalOriginals} original{totalOriginals !== 1 ? "s" : ""}
											</span>
										)}
									</div>
									<span className="text-white/40 text-sm">{isTOpen ? "▲" : "▼"}</span>
								</button>

								{isTOpen && (
									<div className="border-t border-white/5 px-4 py-3 flex flex-col gap-2">
										{Object.entries(stages).map(([stageName, stageMaps]) => {
											const stageKey = `${tournamentName}::${stageName}`;
											const isSOpen = openStages.has(stageKey);
											const stageOriginals = stageMaps.filter((m) => m.isCustomSong).length;
											return (
												<div key={stageKey} className="rounded-lg border border-white/5 bg-tuned/60 overflow-hidden">
													<button
														type="button"
														onClick={() => toggleStage(stageKey)}
														className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/5 transition-colors"
													>
														<div className="flex items-center gap-3">
															<span className="text-sm font-medium text-white/80">
																{STAGE_LABELS[stageName] ?? stageName}
															</span>
															<span className="text-xs text-white/40">{stageMaps.length} maps</span>
															{stageOriginals > 0 && (
																<span className="rounded bg-mintGreen/80 px-1.5 py-0.5 text-xs font-bold text-black">
																	{stageOriginals} original{stageOriginals !== 1 ? "s" : ""}
																</span>
															)}
														</div>
														<span className="text-white/40 text-xs">{isSOpen ? "▲" : "▼"}</span>
													</button>

													{isSOpen && (
														<div className="border-t border-white/5 flex flex-col gap-1.5 p-2">
															{stageMaps.map((map) => (
																<div
																	key={map.id}
																	className="flex items-center justify-between rounded bg-deepCharcoal/80 px-3 py-2"
																>
																	<div className="flex items-center gap-3 min-w-0">
																		<span
																			className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white ${MOD_COLORS[map.modification ?? ""] ?? "bg-gray-600"}`}
																		>
																			{map.modification}
																		</span>
																		<div className="min-w-0">
																			<p className="truncate text-sm font-medium text-white">{map.title}</p>
																			<p className="truncate text-xs text-white/40">{map.artist}</p>
																		</div>
																	</div>
																	<ToggleCustomSongButton map={map} onToggled={onToggled} />
																</div>
															))}
														</div>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</Card>
	);
};

// ─── Main component ───────────────────────────────────────────────────────────

interface EditState {
	mod: string;
	editionName: string;
	position: string;
	isCustomSong: boolean;
	saving: boolean;
}

interface CustomMapsAdminProps {
	maps: CustomBeatmapResponseDto[];
	mappoolMaps: CustomBeatmapResponseDto[];
}

export const CustomMapsAdmin = ({ maps: initialMaps, mappoolMaps: initialMappoolMaps }: CustomMapsAdminProps) => {
	const [maps, setMaps] = useState(initialMaps);
	const [mappoolMaps, setMappoolMaps] = useState(initialMappoolMaps);
	const [url, setUrl] = useState("");
	const [mod, setMod] = useState<string>(modification.NM);
	const [editionName, setEditionName] = useState("");
	const [position, setPosition] = useState("1");
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editState, setEditState] = useState<EditState | null>(null);
	const [openEditions, setOpenEditions] = useState<Set<string>>(new Set());

	const toggleEdition = (name: string) =>
		setOpenEditions((prev) => {
			const next = new Set(prev);
			next.has(name) ? next.delete(name) : next.add(name);
			return next;
		});

	const handleToggleMappoolCustomSong = (updated: CustomBeatmapResponseDto) => {
		setMappoolMaps((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
	};

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
				toast.error(result.errorMessage, { duration: 4000 });
				return;
			}
			setMaps((prev) => [...prev, result.data]);
			setOpenEditions((prev) => new Set(prev).add(result.data.tournamentName));
			setUrl("");
			setPosition("1");
			toast.success(`${result.data.title} added.`, { duration: 2500 });
		} finally {
			setLoading(false);
		}
	};

	const handleRefreshPlayCounts = async () => {
		setRefreshing(true);
		const result = await refreshPlayCountsAction();
		setRefreshing(false);
		if (!result.status) {
			toast.error(result.errorMessage, { duration: 4000 });
		} else {
			toast.success("Play counts refreshed.", { duration: 2500 });
		}
	};

	const startEdit = (map: CustomBeatmapResponseDto) => {
		setEditingId(map.id);
		setEditState({
			mod: map.modification ?? modification.NM,
			editionName: map.tournamentName,
			position: String(map.position),
			isCustomSong: map.isCustomSong ?? false,
			saving: false,
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditState(null);
	};

	const handleSave = async (id: string) => {
		if (!editState) return;
		setEditState((s) => s && { ...s, saving: true });
		const result = await updateCustomMapAction(
			id,
			editState.mod as typeof modification.NM,
			editState.editionName,
			parseInt(editState.position),
			editState.isCustomSong,
		);
		setEditState((s) => s && { ...s, saving: false });
		if (!result.status) {
			toast.error(result.errorMessage, { duration: 4000 });
			return;
		}
		setMaps((prev) => prev.map((m) => (m.id === id ? result.data : m)));
		setEditingId(null);
		setEditState(null);
		toast.success("Map updated.", { duration: 2500 });
	};

	// Group standalone maps by edition name
	const byEdition: Record<string, CustomBeatmapResponseDto[]> = {};
	for (const map of maps) {
		if (!byEdition[map.tournamentName]) byEdition[map.tournamentName] = [];
		byEdition[map.tournamentName].push(map);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Add form */}
			<Card title="Add custom map">
				<form onSubmit={handleAdd} className="flex flex-col gap-4">
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
					<Button type="submit" loading={loading}>
						Add map
					</Button>
				</form>
			</Card>

			{/* Standalone maps — grouped by edition, collapsible */}
			<Card
				title={`Standalone custom maps (${maps.length})`}
				headerAction={
					<Button
						type="button"
						className="text-sm"
						loading={refreshing}
						onClick={handleRefreshPlayCounts}
					>
						Refresh play counts
					</Button>
				}
			>
				{maps.length === 0 ? (
					<p className="py-6 text-center text-white/40">No standalone custom maps yet.</p>
				) : (
					<div className="flex flex-col gap-3">
						{Object.entries(byEdition).map(([edition, editionMaps]) => {
							const isOpen = openEditions.has(edition);
							const originals = editionMaps.filter((m) => m.isCustomSong).length;
							return (
								<div key={edition} className="rounded-lg border border-white/5 bg-deepCharcoal/60 overflow-hidden">
									{/* Edition header */}
									<button
										type="button"
										onClick={() => toggleEdition(edition)}
										className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="font-semibold text-white">{edition}</span>
											<span className="text-xs text-white/40">
												{editionMaps.length} map{editionMaps.length !== 1 ? "s" : ""}
											</span>
											{originals > 0 && (
												<span className="rounded bg-mintGreen px-1.5 py-0.5 text-xs font-bold text-black">
													{originals} original{originals !== 1 ? "s" : ""}
												</span>
											)}
										</div>
										<span className="text-white/40 text-sm">{isOpen ? "▲" : "▼"}</span>
									</button>

									{/* Map rows */}
									{isOpen && (
										<div className="border-t border-white/5 flex flex-col gap-1.5 p-2">
											{editionMaps.map((map) => (
												<div key={map.id} className="flex flex-col rounded-lg border border-white/5 bg-tuned/60 overflow-hidden">
													<div className="flex items-center justify-between px-3 py-2.5">
														<div className="flex items-center gap-3 min-w-0">
															<span
																className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white ${MOD_COLORS[map.modification ?? ""] ?? "bg-gray-600"}`}
															>
																{map.modification}
															</span>
															<div className="min-w-0">
																<p className="truncate text-sm font-medium text-white">
																	{map.title}
																	{map.isCustomSong && (
																		<span className="ml-2 rounded bg-mintGreen px-1.5 py-0.5 text-xs font-bold text-black">
																			ORIGINAL
																		</span>
																	)}
																</p>
																<p className="truncate text-xs text-white/40">
																	{map.artist} #{map.position}
																</p>
															</div>
														</div>
														<div className="ml-4 flex shrink-0 gap-3">
															<button
																onClick={() => editingId === map.id ? cancelEdit() : startEdit(map)}
																className="text-xs text-blue-400 hover:text-blue-300"
															>
																{editingId === map.id ? "Cancel" : "Edit"}
															</button>
															<DeleteMapButton
																map={map}
																onDeleted={(id) => {
																	setMaps((prev) => prev.filter((m) => m.id !== id));
																	if (editingId === id) setEditingId(null);
																}}
															/>
														</div>
													</div>

													{editingId === map.id && editState && (
														<div className="border-t border-white/5 bg-deepCharcoal/80 px-4 py-4 flex flex-col gap-4">
															<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
																<Input
																	name="editionName"
																	label="Edition name"
																	value={editState.editionName}
																	onChange={(e) => setEditState((s) => s && { ...s, editionName: e.target.value })}
																/>
																<Input
																	name="position"
																	label="Position"
																	type="number"
																	value={editState.position}
																	onChange={(e) => setEditState((s) => s && { ...s, position: e.target.value })}
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
																				onClick={() => setEditState((s) => s && { ...s, mod: o.value })}
																				className={`rounded px-3 py-1.5 text-sm font-bold text-white transition-opacity ${
																					editState.mod === o.value ? MOD_COLORS[o.label] : "bg-gray-600 opacity-50"
																				}`}
																			>
																				{o.label}
																			</button>
																		))}
																	</div>
																</div>
															</div>
															<label className="flex cursor-pointer items-center gap-3">
																<input
																	type="checkbox"
																	className="checkbox"
																	checked={editState.isCustomSong}
																	onChange={(e) => setEditState((s) => s && { ...s, isCustomSong: e.target.checked })}
																/>
																<span className="text-sm font-medium text-white">
																	Original song{" "}
																	<span className="text-white/40 font-normal">(music was made specifically for this tournament)</span>
																</span>
															</label>
															<Button
																type="button"
																loading={editState.saving}
																onClick={() => handleSave(map.id)}
															>
																Save changes
															</Button>
														</div>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</Card>

			{/* Mappool custom maps — collapsible tournament → stage */}
			<MappoolMapsSection
				maps={mappoolMaps}
				onToggled={handleToggleMappoolCustomSong}
			/>
		</div>
	);
};

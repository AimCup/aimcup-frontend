import { modification } from "../../client";

export type ParsedMappoolEntry = {
	lineNumber: number;
	raw: string;
	slot: string;
	modification: modification;
	position: number;
	beatmapId: string;
};

export type MappoolPasteError = {
	lineNumber: number;
	raw: string;
	message: string;
};

export type MappoolPasteResult = {
	entries: ParsedMappoolEntry[];
	errors: MappoolPasteError[];
};

const modifications = Object.values(modification);

// Mirrors the shapes the API accepts: a bare beatmap id, a beatmapset url or a direct beatmap url.
const beatmapsetUrlPattern = /osu\.ppy\.sh\/beatmapsets\/\d+#(\w+)\/(\d+)/;
const directUrlPattern = /osu\.ppy\.sh\/(?:b|beatmaps)\/(\d+)/;

const parseBeatmapId = (reference: string): { beatmapId: string } | { error: string } => {
	if (/^\d+$/.test(reference)) {
		return { beatmapId: reference };
	}

	const beatmapsetMatch = beatmapsetUrlPattern.exec(reference);
	if (beatmapsetMatch) {
		if (beatmapsetMatch[1] !== "osu") {
			return { error: `"${reference}" is not an osu! standard beatmap.` };
		}
		return { beatmapId: beatmapsetMatch[2] };
	}

	const directMatch = directUrlPattern.exec(reference);
	if (directMatch) {
		return { beatmapId: directMatch[1] };
	}

	return { error: `"${reference}" is not a beatmap id or url.` };
};

const parseSlot = (
	slot: string,
): { modification: modification; position: number } | { error: string } => {
	const match = /^([A-Za-z]{2})(\d*)$/.exec(slot);
	if (!match) {
		return { error: `"${slot}" is not a valid slot (expected something like NM1).` };
	}

	const parsedModification = match[1].toUpperCase() as modification;
	if (!modifications.includes(parsedModification)) {
		return { error: `"${match[1]}" is not a known modification.` };
	}

	// A slot without a number (e.g. "TB") is treated as the first map of that modification.
	const position = match[2] === "" ? 1 : Number(match[2]);
	if (position < 1) {
		return { error: `Position in "${slot}" must be 1 or higher.` };
	}

	return { modification: parsedModification, position };
};

/**
 * Parse a pasted mappool of "<slot><whitespace><beatmap id>" lines, e.g.
 *
 *     NM1	5755404
 *     NM2	5234607
 *     TB1	https://osu.ppy.sh/beatmapsets/2581785#osu/5755404
 *
 * Blank lines are ignored. Every problem found is reported so the whole paste can be
 * accepted or rejected as one unit.
 */
export const parseMappoolPaste = (paste: string): MappoolPasteResult => {
	const entries: ParsedMappoolEntry[] = [];
	const errors: MappoolPasteError[] = [];
	const seenSlots = new Map<string, number>();

	paste.split(/\r?\n/).forEach((line, index) => {
		const lineNumber = index + 1;
		const raw = line.trim();
		if (raw === "") return;

		const columns = raw.split(/\s+/);
		if (columns.length !== 2) {
			errors.push({
				lineNumber,
				raw,
				message:
					columns.length < 2
						? "Expected a slot and a beatmap id, e.g. NM1 5755404."
						: "Expected only a slot and a beatmap id on this line.",
			});
			return;
		}

		const slotResult = parseSlot(columns[0]);
		if ("error" in slotResult) {
			errors.push({ lineNumber, raw, message: slotResult.error });
			return;
		}

		const beatmapResult = parseBeatmapId(columns[1]);
		if ("error" in beatmapResult) {
			errors.push({ lineNumber, raw, message: beatmapResult.error });
			return;
		}

		const slot = `${slotResult.modification}${slotResult.position}`;
		const duplicateOf = seenSlots.get(slot);
		if (duplicateOf !== undefined) {
			errors.push({
				lineNumber,
				raw,
				message: `Slot ${slot} is already used on line ${duplicateOf}.`,
			});
			return;
		}
		seenSlots.set(slot, lineNumber);

		entries.push({
			lineNumber,
			raw,
			slot,
			modification: slotResult.modification,
			position: slotResult.position,
			beatmapId: beatmapResult.beatmapId,
		});
	});

	return { entries, errors };
};

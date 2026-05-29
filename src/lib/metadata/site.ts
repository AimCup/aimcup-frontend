import type { Metadata } from "next";
import type { TournamentResponseDto } from "../../../client";
import { stageTypeEnumToString } from "@/lib/helpers";

export const SITE_NAME = "AimCup";
export const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://aimcup.xyz";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aimcup.xyz";

export const BRAND = {
	themeColor: "#151120",
	accentColor: "#CA191B",
	tuned: "#241e38",
} as const;

const DEFAULT_DESCRIPTION =
	"AimCup — osu! tournament platform. Register, compete in team and auction tournaments, and follow brackets, mappools, and schedules.";

// PNG over SVG: Discord and most OG crawlers do not reliably render SVG og:image.
const OG_IMAGE_PATH = "/aim_logo.png";
const OG_IMAGE_SIZE = { width: 1000, height: 857 } as const;

export function stripHtml(text: string): string {
	return text
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/\s+/g, " ")
		.trim();
}

export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return `${text.slice(0, maxLength - 1).trim()}…`;
}

function formatTournamentType(type: TournamentResponseDto["tournamentType"]): string {
	switch (type) {
		case "TEAM_VS":
			return "Team vs";
		case "PARTICIPANT_VS":
			return "Participant vs";
		case "INTERNATIONAL":
			return "International";
		default:
			return "Tournament";
	}
}

export function formatTournamentDescription(tournament: TournamentResponseDto): string {
	const parts: string[] = [formatTournamentType(tournament.tournamentType)];

	if (tournament.currentStage) {
		parts.push(stageTypeEnumToString(tournament.currentStage));
	}

	if (tournament.canRegister) {
		parts.push("Registration open");
	}

	if (tournament.rules) {
		const plain = truncate(stripHtml(tournament.rules), 120);
		if (plain) {
			parts.push(plain);
		}
	}

	return parts.join(" · ");
}

export function tournamentBannerUrl(abbreviation: string): string {
	return `${API_URL}/tournaments/${abbreviation}/banner`;
}

function buildOpenGraph(
	title: string,
	description: string,
	url: string,
	imageUrl: string,
	imageAlt: string,
	imageSize: { width: number; height: number } = { width: 1200, height: 630 },
): Metadata["openGraph"] {
	return {
		type: "website",
		siteName: SITE_NAME,
		title,
		description,
		url,
		images: [
			{
				url: imageUrl,
				width: imageSize.width,
				height: imageSize.height,
				alt: imageAlt,
			},
		],
	};
}

function buildTwitter(title: string, description: string, imageUrl: string): Metadata["twitter"] {
	return {
		card: "summary_large_image",
		title,
		description,
		images: [imageUrl],
	};
}

export function buildDefaultMetadata(overrides?: Partial<Metadata>): Metadata {
	const title = SITE_NAME;
	const description = DEFAULT_DESCRIPTION;
	const imageUrl = OG_IMAGE_PATH;

	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default: title,
			template: `%s | ${SITE_NAME}`,
		},
		description,
		applicationName: SITE_NAME,
		themeColor: BRAND.themeColor,
		openGraph: buildOpenGraph(title, description, SITE_URL, imageUrl, SITE_NAME, OG_IMAGE_SIZE),
		twitter: buildTwitter(title, description, imageUrl),
		...overrides,
	};
}

export function buildHomeMetadata(): Metadata {
	const title = SITE_NAME;
	const description = DEFAULT_DESCRIPTION;

	return {
		title: { absolute: title },
		description,
		openGraph: buildOpenGraph(title, description, SITE_URL, OG_IMAGE_PATH, SITE_NAME, OG_IMAGE_SIZE),
		twitter: buildTwitter(title, description, OG_IMAGE_PATH),
	};
}

export function buildTournamentMetadata(
	tournament: TournamentResponseDto,
	abbreviation: string,
): Metadata {
	const title = tournament.name;
	const description = formatTournamentDescription(tournament);
	const url = `${SITE_URL}/tournament/${abbreviation}`;
	const imageUrl = tournamentBannerUrl(abbreviation);

	return {
		title,
		description,
		openGraph: buildOpenGraph(title, description, url, imageUrl, tournament.name),
		twitter: buildTwitter(title, description, imageUrl),
	};
}

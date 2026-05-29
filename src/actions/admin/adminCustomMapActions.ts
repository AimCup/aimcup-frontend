"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addCustomMap, deleteCustomMap, refreshCustomMapPlayCounts, updateCustomMap, updateMappoolBeatmap, client, type modification } from "../../../client";

export async function addCustomMapAction(
	url: string,
	mod: modification,
	editionName: string,
	position: number,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { data, error } = await addCustomMap({
		body: { url, modification: mod, editionName, position },
	});

	if (error) {
		return { status: false as const, errorMessage: "Failed to add map. Check the URL." };
	}

	revalidatePath("/dashboard/custom-maps");
	revalidatePath("/maps");
	return { status: true as const, data };
}

export async function deleteCustomMapAction(id: string) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { error } = await deleteCustomMap({ path: { customMapId: id } });

	if (error) {
		return { status: false as const, errorMessage: "Failed to delete map." };
	}

	revalidatePath("/dashboard/custom-maps");
	revalidatePath("/maps");
	return { status: true as const };
}

export async function updateCustomMapAction(
	id: string,
	mod: modification | undefined,
	editionName: string,
	position: number,
	isCustomSong: boolean,
) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { data, error } = await updateCustomMap({
		path: { customMapId: id },
		body: { modification: mod, editionName, position, isCustomSong },
	});

	if (error) {
		return { status: false as const, errorMessage: "Failed to update map." };
	}

	revalidatePath("/dashboard/custom-maps");
	revalidatePath("/maps");
	return { status: true as const, data };
}

export async function toggleMappoolBeatmapCustomSongAction(beatmapId: string, isCustomSong: boolean) {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { data, error } = await updateMappoolBeatmap({
		path: { beatmapId },
		body: { isCustomSong },
	});

	if (error) {
		return { status: false as const, errorMessage: "Failed to update map." };
	}

	revalidatePath("/dashboard/custom-maps");
	revalidatePath("/maps");
	return { status: true as const, data };
}

export async function refreshPlayCountsAction() {
	"use server";
	const cookie = cookies().get("JWT")?.value;
	client.setConfig({
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: { Cookie: `token=${cookie}` },
	});

	const { error } = await refreshCustomMapPlayCounts();

	if (error) {
		return { status: false as const, errorMessage: "Failed to refresh play counts." };
	}

	revalidatePath("/dashboard/custom-maps");
	revalidatePath("/maps");
	return { status: true as const };
}

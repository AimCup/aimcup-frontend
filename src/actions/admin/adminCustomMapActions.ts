"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addCustomMap, deleteCustomMap, client, type modification } from "../../../client";

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

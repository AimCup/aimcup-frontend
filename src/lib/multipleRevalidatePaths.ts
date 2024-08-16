"use server";
import { revalidatePath } from "next/cache";

export const multipleRevalidatePaths = async (paths: string[]) => {
	"use server";
	paths.forEach((path) => {
		revalidatePath(path);
	});
};

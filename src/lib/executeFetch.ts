"use server";

import { revalidatePath } from "next/cache";
import { type ApiError, OpenAPI } from "../../generated";
import { verifySession } from "@/lib/session";

export type SuccessfulResponse<T> = {
	status: true;
	response: T;
};

export type ErrorResponse = {
	status: false;
	errorMessage: string;
};

export type ApiErrorMessages = {
	errors: string[];
};

export type Response<T> = SuccessfulResponse<T> | ErrorResponse;

export const executeFetch = async <T>(
	fetchRequest: Promise<T>,
	revalidatePaths?: string[],
): Promise<Response<T>> => {
	"use server";
	const JWT = await verifySession();

	if (typeof JWT.token === "string") {
		OpenAPI.HEADERS = {
			Cookie: `token=${JWT.token}`,
		};
	}

	return fetchRequest
		.then((res) => {
			if (revalidatePaths) {
				revalidatePaths.forEach((path) => {
					revalidatePath(path);
				});
			}
			return { status: true, response: res } as SuccessfulResponse<T>;
		})
		.catch((error) => {
			return {
				status: false,
				errorMessage: ((error as ApiError).body as ApiErrorMessages).errors[0],
			} as ErrorResponse;
		});
};

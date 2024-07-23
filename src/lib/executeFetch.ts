"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type ApiError, OpenAPI } from "../../generated";

export type SuccessfulResponse<T> = {
	status: true;
	response: T;
};

export type ErrorResponse = {
	status: false;
	errorMessage: string;
};

export type Response<T> = SuccessfulResponse<T> | ErrorResponse;

export const executeFetch = async <T>(
	fetchRequest: Promise<T>,
	revalidatePaths?: string[],
): Promise<Response<T>> => {
	"use server";
	const token = cookies().get("token")?.value;

	if (token) {
		OpenAPI.HEADERS = {
			Cookie: `token=${token}`,
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
			return { status: false, errorMessage: (error as ApiError).message } as ErrorResponse;
		});
};

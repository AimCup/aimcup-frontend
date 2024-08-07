"use client";

import { useFormState } from "react-dom";
import { type TypeOf, type ZodType } from "zod";

type FormContract<
	TData = unknown,
	TErrors extends Partial<Record<keyof TData, string[]>> = Partial<Record<keyof TData, string[]>>,
> = { success: true; errors: TErrors; response: TData } | { success: false; errors: TErrors };

// Helper function to convert FormData to an object, handling arrays properly
const formDataToObject = (formData: FormData) => {
	const obj: Record<string, unknown> = {};
	formData.forEach((value, key) => {
		if (key.endsWith("[]")) {
			const actualKey = key.slice(0, -2);
			if (!obj[actualKey]) {
				obj[actualKey] = [];
			}
			(obj[actualKey] as unknown[]).push(value);
		} else {
			obj[key] = value;
		}
	});
	return obj;
};

export const useTypeSafeFormState = <FormSchema extends ZodType>(
	schema: FormSchema,
	action: (data: TypeOf<FormSchema>) => Promise<unknown>,
) => {
	return useFormState(
		async (
			_prevState: unknown,
			formData: FormData,
		): Promise<FormContract<TypeOf<FormSchema>>> => {
			const formDataObject = formDataToObject(formData);
			const data = await schema.safeParseAsync(formDataObject);

			if (!data.success) {
				return {
					success: false,
					errors: data.error.flatten().fieldErrors as Partial<
						Record<keyof TypeOf<FormSchema>, string[]>
					>,
				};
			}

			const newState = {
				success: true as const,
				errors: {},
				response: data.data as unknown,
			};
			await action(data.data as unknown);

			return newState;
		},
		null,
	);
};

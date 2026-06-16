"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

export interface SubmitButtonProps {
	children: React.ReactNode;
	className?: string;
	/** Optional label shown while the enclosing form action is pending. */
	pendingText?: string;
	disabled?: boolean;
}

/**
 * Submit button for `<form action={serverAction}>` blocks. Reads the parent form's pending state via
 * useFormStatus and shows a spinner + disables itself while the request is in flight.
 */
export const SubmitButton = ({ children, className, pendingText, disabled }: SubmitButtonProps) => {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={disabled || pending}
			aria-busy={pending}
			className={twMerge(
				"flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
		>
			{pending && <span className="loading loading-spinner loading-xs" />}
			{pending && pendingText ? pendingText : children}
		</button>
	);
};

import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export interface ButtonProps {
	children: React.ReactNode;
	onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	/** When true, shows a spinner and disables the button (use while a request is in flight). */
	loading?: boolean;
	className?: string;
	style?: React.CSSProperties;
	href?: string;
	type?: "button" | "submit" | "reset";
	props?: { [key: string]: never };
}

export const Button = ({
	children,
	onClick,
	className,
	style,
	href,
	type = "button",
	disabled = false,
	loading = false,
	...props
}: ButtonProps) => {
	const buttonClassNames = twMerge(
		`text-white rounded-md bg-deepRed px-6 py-2 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 max-w-max`,
		className,
	);

	if (href) {
		return (
			<Link href={href} passHref className={buttonClassNames} style={style} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<button
			disabled={disabled || loading}
			onClick={onClick}
			className={buttonClassNames}
			style={style}
			type={type}
			{...props}
		>
			{loading && <span className="loading loading-spinner loading-sm" />}
			{children}
		</button>
	);
};

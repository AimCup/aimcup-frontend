import React from "react";
import Link from "next/link";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
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
	...props
}: ButtonProps) => {
	const buttonClassNames = `text-white rounded-md bg-deepRed px-6 py-2 hover:opacity-80 ${className}`;

	if (href) {
		return (
			<Link href={href} passHref className={buttonClassNames} style={style} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<button onClick={onClick} className={buttonClassNames} style={style} type={type} {...props}>
			{children}
		</button>
	);
};

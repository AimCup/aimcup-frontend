import React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
	children: React.ReactNode;
	className?: string;
	/** Optional section title rendered as a card header. */
	title?: React.ReactNode;
	/** Optional content rendered on the right side of the header (e.g. actions). */
	headerAction?: React.ReactNode;
}

/**
 * Panel/section surface used across the dashboard. Matches the admin palette
 * (tuned background, subtle white border).
 */
export const Card = ({ children, className, title, headerAction }: CardProps) => {
	return (
		<section
			className={twMerge(
				"rounded-xl border border-white/[0.06] bg-tuned p-5 sm:p-6",
				className,
			)}
		>
			{(title || headerAction) && (
				<div className="mb-4 flex items-center justify-between gap-3">
					{title && <h2 className="text-lg font-bold text-white">{title}</h2>}
					{headerAction}
				</div>
			)}
			{children}
		</section>
	);
};

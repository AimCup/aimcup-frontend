import React from "react";

export interface PageHeaderProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	/** Optional actions rendered on the right (buttons, links). */
	actions?: React.ReactNode;
}

/**
 * Consistent dashboard page header: title + optional subtitle on the left, optional actions on the right.
 */
export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
				{subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
			</div>
			{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
		</div>
	);
};

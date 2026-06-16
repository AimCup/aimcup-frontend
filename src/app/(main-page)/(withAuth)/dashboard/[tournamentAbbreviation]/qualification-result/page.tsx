import React from "react";
import { PageHeader } from "@ui/molecules/PageHeader/PageHeader";
import { Card } from "@ui/atoms/Card/Card";

const QualificationResultsPage = () => {
	return (
		<div className="flex w-full flex-col gap-6">
			<PageHeader
				title="Qualification results"
				subtitle="View and manage qualification results for this tournament."
			/>

			<Card>
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="text-lg font-semibold text-white/60">Coming soon</p>
					<p className="mt-2 text-sm text-white/30">
						Qualification results will be available here once the feature is ready.
					</p>
				</div>
			</Card>
		</div>
	);
};

export default QualificationResultsPage;

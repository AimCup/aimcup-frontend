import React from "react";

export default function Loading() {
	return (
		<div className="flex min-h-[40vh] w-full items-center justify-center">
			<span className="loading loading-spinner loading-lg text-deepRed" />
		</div>
	);
}

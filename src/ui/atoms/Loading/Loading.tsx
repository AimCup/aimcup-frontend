import React from "react";

export const Loading = ({ size = "md" }: { size: "sm" | "md" | "lg" }) => {
	let sizeClass = "";
	switch (size) {
		case "sm":
			sizeClass = "h-10 w-10";
			break;
		case "md":
			sizeClass = "h-20 w-20";
			break;
		case "lg":
			sizeClass = "h-40 w-40";
			break;
		default:
			sizeClass = "h-20 w-20";
			break;
	}

	return (
		<>
			<div className="flex h-screen items-center justify-center">
				<div className={`${sizeClass} animate-ping rounded-full bg-deepRed`}></div>
			</div>
		</>
	);
};

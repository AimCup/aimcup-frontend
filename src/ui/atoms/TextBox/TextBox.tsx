import React from "react";

export const TextBox = ({
	children,
	size = "md",
}: {
	children: React.ReactNode;
	size?: "sm" | "md" | "lg";
}) => {
	let higthSize;
	if (size === "sm") {
		higthSize = "max-h-10";
	} else if (size === "md") {
		higthSize = "max-h-20";
	} else if (size === "lg") {
		higthSize = "max-h-32";
	}
	let triangleSize;
	if (size === "sm") {
		triangleSize = "20px";
	} else if (size === "md") {
		triangleSize = "40px";
	} else if (size === "lg") {
		triangleSize = "60px";
	}

	return (
		<div
			className={`text-white flex w-full rounded-bl-md rounded-tl-md rounded-tr-md ${higthSize}`}
		>
			<div
				className={
					" flex w-full items-center justify-between gap-1 rounded-bl-md rounded-tl-md  bg-deepRed pl-3.5 font-bold"
				}
			>
				{children}
			</div>
			<div className={"flex flex-col items-center"}>
				<div
					className={"rounded-tr-md"}
					style={{
						height: triangleSize,
						width: triangleSize,
						backgroundColor: "#CA191B",
					}}
				></div>
				<div
					style={{
						borderBottom: `${triangleSize} solid transparent`,
						borderLeft: `${triangleSize} solid #CA191B`,
					}}
				/>
			</div>
		</div>
	);
};

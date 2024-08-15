import React from "react";
import { twMerge } from "tailwind-merge";

interface ISectionProps {
	children: React.ReactNode;
	className?: string;
	id?: string;
}

/** Section component (correctly margin and padding) **/
const Section = ({ children, className, id }: ISectionProps) => {
	return (
		<main className={"text-white container mx-auto"}>
			<section
				id={id}
				className={twMerge(
					"divide-gray-700 md:px-18 md:py-18 flex w-full px-8 py-10 lg:px-20 lg:py-20",
					className,
				)}
			>
				{children}
			</section>
		</main>
	);
};

export default Section;

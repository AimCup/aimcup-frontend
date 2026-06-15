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
		<main className={"container mx-auto text-white"}>
			<section id={id} className={twMerge("flex w-full py-6 md:py-8", className)}>
				{children}
			</section>
		</main>
	);
};

export default Section;

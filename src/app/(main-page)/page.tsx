"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@ui/atoms/Button/Button";

const Main = () => {
	return (
		<>
			<section className={"flex h-[calc(100vh-4rem)] items-center justify-center"}>
				<Image
					src="/2500x1500.png"
					alt="aimcup logo"
					width={2880}
					height={1928}
					className={"h-full w-full object-cover"}
				/>
			</section>
			<section id="tournaments" className={"h-80"}>
				tournaments
				<Button onClick={() => {}}>eloszka</Button>
			</section>
			<section id="about" className={"h-80"}>
				about
			</section>
			<section id="socials" className={"h-80"}>
				socials
			</section>
		</>
	);
};

export default Main;

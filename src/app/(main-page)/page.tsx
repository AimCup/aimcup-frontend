"use client";
import React from "react";
import Image from "next/image";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { Button } from "@ui/atoms/Button/Button";

const Main = () => {
	return (
		<>
			<section className={"relative h-[calc(100vh-64px)]"}>
				<Image
					src="/placeholder.png"
					alt="aimcup logo"
					className="h-full w-full object-cover"
					layout="fill"
				/>
				<Link href="/#tournaments">
					<MdKeyboardArrowDown
						size={"100px"}
						className={
							"absolute bottom-0 left-1/2 -translate-x-1/2 transform animate-bounce"
						}
					/>
				</Link>
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

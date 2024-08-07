"use client";
import React from "react";
import Image from "next/image";
import { SiOsu } from "react-icons/si";
import { Button } from "@ui/atoms/Button/Button";

const RegisterPage = () => {
	// const user = useAppSelector<UserResponseDTO>((state) => state.user);
	//
	// if (user.id) {
	// 	redirect("/", RedirectType.replace);
	// 	return null;
	// }
	//todo

	const redirectUri = encodeURIComponent(
		process.env.NEXT_PUBLIC_URL || "https://next.aimcup.xyz",
	);

	return (
		<section className={"relative h-[calc(100vh-64px)] w-full"}>
			<Image
				src="/main-page.png"
				alt="aimcup logo"
				className="h-full w-full object-cover"
				fill={true}
			/>
			<div
				className={
					"absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-8 text-center"
				}
			>
				<Image src={"/aim_logo.png"} alt={"logo"} width={300} height={300} />
				<h1 className={"text-5xl font-bold uppercase md:text-6xl lg:text-8xl"}>Aim Cup</h1>
			</div>

			<Button
				className={
					"absolute bottom-1/3 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-row items-center gap-4 text-center"
				}
				href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`}
			>
				<SiOsu size={25} /> Log in via osu!
			</Button>
		</section>
	);
};

export default RegisterPage;

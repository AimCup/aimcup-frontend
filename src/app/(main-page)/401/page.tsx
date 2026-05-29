import React from "react";
import Link from "next/link";
import Section from "@ui/atoms/Section/Section";
import { Button } from "@ui/atoms/Button/Button";

export default function UnauthorizedPage() {
	const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_URL || "https://aimcup.xyz");

	return (
		<Section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
			<h1 className="mb-2 text-3xl font-bold">401 — Unauthorized</h1>
			<p className="mb-8 max-w-md text-base-content/80">
				You need to be logged in to access this page.
			</p>
			<div className="flex flex-wrap justify-center gap-4">
				<Button
					href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/osu?redirect_uri=${redirectUri}/`}
				>
					Log in with osu!
				</Button>
				<Link href="/register" className="btn btn-ghost">
					Register
				</Link>
				<Link href="/" className="btn btn-ghost">
					Home
				</Link>
			</div>
		</Section>
	);
}

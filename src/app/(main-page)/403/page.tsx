import React from "react";
import Link from "next/link";
import Section from "@ui/atoms/Section/Section";

export default function ForbiddenPage() {
	return (
		<Section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
			<h1 className="mb-2 text-3xl font-bold">403 — Forbidden</h1>
			<p className="mb-8 max-w-md text-base-content/80">
				You do not have permission to access this page. Tournament dashboard access is
				limited to staff members.
			</p>
			<Link href="/" className="btn btn-primary">
				Back to home
			</Link>
		</Section>
	);
}

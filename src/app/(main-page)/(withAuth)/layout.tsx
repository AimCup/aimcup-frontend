import React from "react";
import { AuthGuard } from "@/lib/Providers/AuthGuard";

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
	return <AuthGuard>{children}</AuthGuard>;
}

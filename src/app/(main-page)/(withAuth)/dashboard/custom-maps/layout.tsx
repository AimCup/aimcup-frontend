import React from "react";
import { requireGlobalAdmin } from "@/lib/guards/staffMemberGuard";

export default async function CustomMapsLayout({ children }: { children: React.ReactNode }) {
	await requireGlobalAdmin();
	return <>{children}</>;
}

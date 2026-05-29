import React from "react";
import { requireAuth } from "@/lib/guards/staffMemberGuard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	await requireAuth();
	return <>{children}</>;
}

import React from "react";
import { requireDashboardAccess } from "@/lib/guards/staffMemberGuard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	await requireDashboardAccess();
	return <>{children}</>;
}

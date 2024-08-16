import { cache } from "react";
import { me } from "../../../client";
import { verifySession } from "@/lib/session";

export const getUser = cache(async () => {
	const JWT = await verifySession();
	if (typeof JWT.token === "string" && JWT.isAuth) {
		const { data } = await me();
		return data;
	}
	return null;
});

import { OpenAPI, UserService } from "../../../generated";
import { verifySession } from "@/lib/session";

export const getUser = async () => {
	const JWT = await verifySession();
	if (typeof JWT.token === "string" && JWT.isAuth) {
		OpenAPI.HEADERS = {
			Cookie: `token=${JWT.token}`,
		};
		const userData = await UserService.me();
		return userData;
	}
	return null;
};

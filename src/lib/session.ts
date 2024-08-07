import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SECRET_LOGIN_KEY;
const key = new TextEncoder().encode(secretKey);

type SessionPayload = {
	token: string | number;
	expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(key);
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, key, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (error) {
		return null;
	}
}

export async function createSession(token: string, redirectUrl: string) {
	const expiresAt = new Date(Date.now() + 86400000);
	const session = await encrypt({ token, expiresAt });

	cookies().set("JWT", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});

	redirect(redirectUrl);
}

export async function verifySession() {
	const cookie = cookies().get("JWT")?.value;
	const session = await decrypt(cookie);

	if (!session?.token) {
		return { isAuth: false, token: null };
	}

	return { isAuth: true, token: session.token };
}

export async function updateSession() {
	const session = cookies().get("JWT")?.value;
	const payload = await decrypt(session);

	if (!session || !payload) {
		return null;
	}

	const expires = new Date(Date.now() + 86400000);
	cookies().set("JWT", session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: "lax",
		path: "/",
	});
}

export function deleteSession() {
	cookies().delete("JWT");
	// window reload
}

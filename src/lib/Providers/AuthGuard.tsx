"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserResponseDTO } from "../../../generated";
import { useAppSelector } from "@/lib/redux/hooks";
import { Loading } from "@ui/atoms/Loading/Loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const user = useAppSelector<UserResponseDTO>((state) => state.user);
	const [isLogged, setIsLogged] = React.useState<boolean | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (user.id) {
			setIsLogged(true);
		} else {
			setIsLogged(false);
			// Redirect to login page only if confirmed unauthenticated
			if (isLogged === false) {
				router.replace("/register");
			}
		}
	}, [isLogged, router, user.id]);

	// Authenticated not confirmed yet
	if (isLogged === null) {
		return <Loading size={"lg"} />;
	}

	// Confirmed authentication
	return isLogged ? children : null;
};

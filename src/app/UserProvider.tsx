"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { type UserResponseDTO } from "../../generated";
import { setUser } from "@/lib/redux/features/user/userSlice";

export default function UserProvider({
	children,
	userData,
}: {
	children: React.ReactNode;
	userData: UserResponseDTO;
}) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setUser(userData));
	}, [dispatch, userData]);

	return children;
}

"use client";

export const LogoutButton = () => {
	const logout = async () => {
		const response = await fetch("/api/logout", {
			method: "POST",
		});
		const data = await response.json();
		if (data.status) {
			window.location.href = "/";
		}
	};

	return <div onClick={logout}>Log out</div>;
};

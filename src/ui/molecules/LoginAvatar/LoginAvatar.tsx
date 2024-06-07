import React from "react";
import { Avatar } from "@ui/atoms/Avatar/Avatar";
import { Button } from "@ui/atoms/Button/Button";

interface ILoginAvatar {
	isLogged: boolean;
}

export const LoginAvatar = (props: ILoginAvatar) => {
	const { isLogged } = props;

	if (!isLogged) {
		return <Button href={"/"}>Log in</Button>;
	}

	return (
		<div className="m dropdown dropdown-end dropdown-hover">
			<Avatar notificationCount={2} className={"ml-2"} />
			<ul
				tabIndex={0}
				className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li>
					<a>Account</a>
				</li>
				<li>
					<a>Logout</a>
				</li>
			</ul>
		</div>
	);
};

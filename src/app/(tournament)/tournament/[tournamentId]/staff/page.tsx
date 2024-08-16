import React from "react";
import { cookies } from "next/headers";
import { client, getStaffMembers } from "../../../../../../client";
import StaffMember from "@ui/organisms/StaffMember/StaffMember";
import Section from "@ui/atoms/Section/Section";

const SingleTournamentStaff = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const cookie = cookies().get("JWT")?.value;
	// configure internal service client
	client.setConfig({
		// set default base url for requests
		baseUrl: process.env.NEXT_PUBLIC_API_URL,
		// set default headers for requests
		headers: {
			Cookie: `token=${cookie}`,
		},
	});
	const { data: getStaffMembers1 } = await getStaffMembers({
		path: {
			abbreviation: params.tournamentId,
		},
	});

	const isStaff = getStaffMembers1?.some(
		(staff) => staff.staffMembers && staff.staffMembers.length > 0,
	);

	return (
		<Section id="staff" className={"flex-col"}>
			<div className={"mb-10 flex"}>
				<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
					<h2 className={"text-4xl font-bold "}>Staff</h2>
				</div>
			</div>
			{!isStaff && <p>No staff members</p>}
			<div className={"grid grid-cols-1 gap-4"}>
				{isStaff &&
					getStaffMembers1
						?.sort((a, b) => {
							if (a.position < b.position) {
								return -1;
							}
							if (a.position > b.position) {
								return 1;
							}
							return 0;
						})
						.map((staff) => {
							const role = staff.roleName;

							return (
								<div key={staff.position} className={"flex flex-col gap-2"}>
									<h2 className={"mb-10 mt-10 text-2xl font-bold"}>{role}</h2>
									<div
										className={
											"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4"
										}
									>
										{staff?.staffMembers?.map((member) => (
											<StaffMember
												key={member.id}
												staffMember={member}
												role={role}
											/>
										)) || null}
									</div>
								</div>
							);
						})}
			</div>
		</Section>
	);
};

export default SingleTournamentStaff;

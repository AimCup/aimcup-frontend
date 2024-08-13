import React from "react";
import { StaffMemberService } from "../../../../../../generated";
import StaffMember from "@ui/organisms/StaffMember/StaffMember";

const SingleTournamentStaff = async ({
	params,
}: {
	params: {
		tournamentId: string;
	};
}) => {
	const getStaffMembers = await StaffMemberService.getStaffMembers(params.tournamentId);

	const isStaff = getStaffMembers.some(
		(staff) => staff.staffMembers && staff.staffMembers.length > 0,
	);

	return (
		<main className={"text-white container mx-auto"}>
			<section
				id="staff"
				className={
					"divide-gray-700 md:px-18 my-12 flex w-full flex-col gap-4 px-8 lg:px-20"
				}
			>
				<div className={"mb-10 flex"}>
					<div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
						<h2 className={"text-4xl font-bold "}>Staff</h2>
					</div>
				</div>
				{!isStaff && <p>No staff members</p>}
				<div className={"grid grid-cols-2 gap-4 md:w-3/5"}>
					{isStaff &&
						getStaffMembers
							.sort((a, b) => {
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
										<h2 className={"mb-10 text-4xl font-bold"}>{role}</h2>
										{staff?.staffMembers?.map((member) => (
											<StaffMember
												key={member.id}
												staffMember={member}
												role={role}
											/>
										)) || null}
									</div>
								);
							})}
				</div>
			</section>
		</main>
	);
};

export default SingleTournamentStaff;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserResponseDTO } from "../../../../../generated";
import { type RootState } from "@/lib/redux/store";

// Define the initial state using that type
const initialState: UserResponseDTO = {};

export const userSlice = createSlice({
	name: "user",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setUser: (_state, action: PayloadAction<UserResponseDTO>) => {
			return action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;

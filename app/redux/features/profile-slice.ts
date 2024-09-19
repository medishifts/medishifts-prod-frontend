import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: UserProfileState;
};

type UserProfileState = {
    id:string;
    username: string;
    name:string,
    email: string;
    role:string;
    avatarUrl: string;
    isActive: boolean;
};

const initialState = {
    value: {
        id:"",
        username: '',
        email: '',
       name:"",
        avatarUrl: '',
        role:"",
        isActive: false,
    } as UserProfileState,
} as InitialState;

export const profile = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<Partial<UserProfileState>>) => {
            // Update only the provided fields in the action payload
            state.value = { ...state.value, ...action.payload };
        },
        toggleActiveStatus: (state) => {
            state.value.isActive = !state.value.isActive;
        },
        resetProfile: () => initialState, // Reset profile to initial state
    },
});

export const { updateProfile, toggleActiveStatus, resetProfile } = profile.actions;
export default profile.reducer;

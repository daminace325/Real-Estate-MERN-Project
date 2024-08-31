import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFaliure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSucess: (state, action) => {
            if (state.currentUser._id === action.payload._id) {
                state.currentUser = action.payload;
            }
            state.loading = false
            state.error = null
        },
        updateUserFaliure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state, action) => {
            if (state.currentUser._id === action.payload._id) {
                state.currentUser = null
            }
            state.loading = false
            state.error = null
        },
        deleteUserFaliure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutUserStart: (state) => {
            state.loading = true
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        signOutUserFaliure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        fetchUsersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess: (state, action) => {
            state.users = action.payload;
            state.loading = false;
        },
        fetchUsersFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})



export const { signInStart, signInSuccess, signInFaliure, updateUserFaliure, updateUserStart, updateUserSucess, deleteUserFaliure, deleteUserStart, deleteUserSuccess, signOutUserFaliure, signOutUserStart, signOutUserSuccess, fetchUsersFailure, fetchUsersStart, fetchUsersSuccess } = userSlice.actions

export default userSlice.reducer
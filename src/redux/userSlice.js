import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        users: [],
        allChats: [],
        currentChat: null,
        userProfileColors: {},

    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setChats: (state, action) => {
            state.allChats = action.payload;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setUserProfileColors: (state, action) => {
            state.userProfileColors = action.payload;
        }
    }
});

export const { setUser, setUsers, setChats, setCurrentChat, setUserProfileColors } = userSlice.actions;
export default userSlice.reducer;
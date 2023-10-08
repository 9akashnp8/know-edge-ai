import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chatMessage',
    initialState: "",
    reducers: {
        setMessage(_, action) {
            return action.payload
        }
    }
})

export const { setMessage } = chatSlice.actions
export default chatSlice.reducer

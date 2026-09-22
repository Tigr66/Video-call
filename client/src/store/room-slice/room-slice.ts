import type { IRoomState } from "@/types/room-state.types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IRoomState = {
    currentRoomCode: null,
    isSending: false,
    isLoading: false
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {},
});

export const {} = roomSlice.actions;

export default roomSlice.reducer;
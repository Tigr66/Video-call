import type { IRoomState } from "@/types/room-state.types";
import { createSlice } from "@reduxjs/toolkit";
import { addRoomThunk, getRoomByCodeThunk } from "./room-thunks";

const initialState: IRoomState = {
    currentRoomCode: null,
    isSending: false,
    isLoading: false,
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addRoomThunk.pending, (state) => {
                state.isSending = true;
            })
            .addCase(addRoomThunk.fulfilled, (state, action) => {
                state.isSending = false;
                state.currentRoomCode = action.payload.code;
            })
            .addCase(addRoomThunk.rejected, (state) => {
                state.isSending = false;
            })
            .addCase(getRoomByCodeThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRoomByCodeThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRoomCode = action.payload.code;
            })
            .addCase(getRoomByCodeThunk.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {} = roomSlice.actions;

export default roomSlice.reducer;

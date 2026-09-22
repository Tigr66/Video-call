import { configureStore } from "@reduxjs/toolkit";
import roomSlice from "./room-slice";

export const store = configureStore({
    reducer: {
        room: roomSlice,
    },
});

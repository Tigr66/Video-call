import { videoCallApi } from "@/api/video-call-api";
import { notifyError } from "@/services/notify.service";
import type { RoomFetchResponse } from "@/types/room-fetch.types";
import { getApiError } from "@/utils/get-api-error";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addRoomThunk = createAsyncThunk<
    RoomFetchResponse,
    void,
    { rejectValue: string }
>("room-slice/create-room", async (_, { rejectWithValue }) => {
    try {
        const response = await videoCallApi.post<RoomFetchResponse>(`/rooms`);

        return response.data;
    } catch (err) {
        const error = getApiError(err);
        notifyError(error);
        return rejectWithValue(error);
    }
});

export const getRoomByCodeThunk = createAsyncThunk<
    RoomFetchResponse,
    string,
    { rejectValue: string }
>("room-slice/get-room-by-code", async (code, { rejectWithValue }) => {
    try {
        const response = await videoCallApi.get<RoomFetchResponse>(
            `/rooms/${code}`,
        );
        return response.data;
    } catch (err) {
        const error = getApiError(err);
        notifyError(error);
        return rejectWithValue(error);
    }
});

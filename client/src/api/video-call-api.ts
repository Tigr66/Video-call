import axios from "axios";

export const BASE_URL: string =
    import.meta.env.VITE_VIDEO_CALL_URL || "http://localhost:8000";

export const videoCallApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

import axios from "axios";

export const BASE_URL: string =
    import.meta.env.VITE_VIDEO_CALL_URL || "http://localhost:8000";

export const WS_URL = BASE_URL.replace(/^http/, "ws");

export const ICE_SERVERS = [
    {
        urls: import.meta.env.VITE_STUN_SERVER,
    },
];

export const videoCallApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

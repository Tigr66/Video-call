import axios from "axios";

export const getApiError = (error: unknown): string => {
    if (axios.isAxiosError<{ error: string }>(error)) {
        return error.response?.data?.error ?? "Unknown error";
    }

    return "Unknown error";
};

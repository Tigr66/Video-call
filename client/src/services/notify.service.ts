import { toast } from "sonner";

export const notifySuccess = (message: string) => {
    toast.success(message);
};

export const notifyError = (message: string) => {
    toast.error(message);
};

export const notifyInfo = (message: string) => {
    toast.info(message);
};

export const notifyWarning = (message: string) => {
    toast.warning(message);
};

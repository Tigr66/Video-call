import { useEffect, useRef, useState } from "react";

const useInviteToast = (seconds?: number, onClose?: () => void) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [width, setWidth] = useState(100);

    const clearCurrentTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const clearCurrentInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        setWidth(100);

        if (seconds) {
            const intervalMs = 100;
            const totalMs = seconds * 1000;

            const steps = totalMs / intervalMs;
            const step = 100 / steps;

            intervalRef.current = setInterval(() => {
                setWidth((prev) => Math.max(0, prev - step));
            }, intervalMs);

            timeoutRef.current = setTimeout(() => {
                clearCurrentInterval();
                onClose?.();
            }, totalMs);
        }

        return () => {
            clearCurrentInterval();
            clearCurrentTimeout();
        };
    }, [seconds, onClose]);

    const url = window.location.href;

    return { url, width };
};

export default useInviteToast;

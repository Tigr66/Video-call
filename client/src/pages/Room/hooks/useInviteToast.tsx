import { ANIMATIONS } from "@/constants/animations.constants";
import { useEffect, useRef, useState } from "react";

const INITIAL_ANIMATION = "hidden";

const useInviteToast = (
    open: boolean,
    seconds?: number,
    onClose?: () => void,
) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [animationClass, setAnimationClass] =
        useState<string>(INITIAL_ANIMATION);
    const isFirstRender = useRef<boolean>(true);

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

        if (open && seconds) {
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
    }, [open, seconds, onClose]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (open) {
            setAnimationClass(ANIMATIONS.toast.adaptive.slideInRight);
        }

        if (animationClass !== "hidden" && !open) {
            setAnimationClass(ANIMATIONS.toast.adaptive.slideOutLeft);
        }
    }, [open]);

    const url = window.location.href;

    return { url, width, animationClass };
};

export default useInviteToast;

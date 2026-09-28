import { Toaster } from "sonner";
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

const AppToastContainer = () => {
    const [isMobile, setIsMobile] = useState<boolean>(
        window.innerWidth < MOBILE_BREAKPOINT,
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Toaster
            richColors
            position={isMobile ? "top-center" : "bottom-right"}
        />
    );
};

export default AppToastContainer;

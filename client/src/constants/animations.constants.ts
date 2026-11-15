export const ANIMATIONS = {
    toast: {
        adaptive: {
            slideInRight: "animate-slide-in-up sm:animate-slide-in-right",
            slideOutLeft: "animate-slide-out-down sm:animate-slide-out-left",
        },
        static: {
            slideInRight: "animate-slide-in-right",
            slideOutLeft: "animate-slide-out-left",
            slideInUp: "animate-slide-in-up",
            slideOutDown: "animate-slide-out-down",
        },
    },
    gradient: "animate-gradient",
} as const;

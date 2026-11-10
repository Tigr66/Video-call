import rateLimit from "express-rate-limit";

export const createRoomLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    handler: (_, res) => {
        res.status(429).json({
            error: "Слишком много запросов, пожалуйста, попробуйте позже.",
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

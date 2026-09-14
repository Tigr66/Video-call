import cors from "cors";
import express from "express";

import { ErrorMiddleware } from "./middlewares/error.middleware";
import expressWs from "express-ws";

export const setupApp = () => {
    
    const { app, getWss } = expressWs(express());

    app.use(express.json());

    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        }),
    );

    app.use(ErrorMiddleware.handle);

    return app;
};

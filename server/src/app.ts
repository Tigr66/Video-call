import cors from "cors";
import express from "express";

import { RoomRoutes } from "./routes/room.routes";

import { ErrorMiddleware } from "./middlewares/error.middleware";
import expressWs from "express-ws";
import { RoomWsService } from "./services/room-ws.service";

export const setupApp = () => {
    const { app, getWss } = expressWs(express());

    const roomRoutes = new RoomRoutes();
    const roomWsService = new RoomWsService(getWss());

    app.use(express.json());

    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        }),
    );

    app.ws("/rooms/:code", roomWsService.initRoom());

    app.use("/rooms", roomRoutes.router);

    app.use(ErrorMiddleware.handle);

    return app;
};

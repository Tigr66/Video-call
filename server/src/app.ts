import cors from "cors";
import express from "express";

import { RoomRoutes } from "./routes/room.routes";
import { RoomWsService } from "./services/room-ws.service";

import { ErrorMiddleware } from "./middlewares/error.middleware";
import expressWs from "express-ws";

export const setupApp = () => {
    const { app } = expressWs(express());

    const roomRoutes = new RoomRoutes();
    const roomWsService = new RoomWsService();

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

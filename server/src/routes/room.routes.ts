import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { createRoomLimiter } from "../middlewares/rate-limit/create-room.limiter";

export class RoomRoutes {
    public router: Router;
    private roomController: RoomController;

    constructor() {
        this.roomController = new RoomController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post("/", createRoomLimiter, this.roomController.create);

        this.router.get("/:code", this.roomController.getRoomByCode);
    }
}

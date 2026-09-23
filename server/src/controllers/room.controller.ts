import { NextFunction, Request, Response } from "express";
import { RoomService } from "../services/room.service";
import { NotFoundError } from "../errors/not-found-error";

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    create = async (_: Request, res: Response, next: NextFunction) => {
        try {
            const room = await this.roomService.createRoom();
            res.status(201).json(room);
        } catch (error) {
            next(error);
        }
    };

    getRoomByCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.params;

            if (typeof code !== "string") {
                return res.status(400).json({ error: "Код должен быть строкой" });
            }

            const result = await this.roomService.getRoomByCode(code);

            if (!result) {
                throw new NotFoundError(`Комната с кодом ${code} не найдена`);
            }

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };
}

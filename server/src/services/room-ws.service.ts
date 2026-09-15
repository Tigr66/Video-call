import WebSocket from "ws";
import { Request } from "express";
import { Participant } from "../types/room-ws.types";
import { BaseWsService } from "./base-ws.service";
import { RoomService } from "./room.service";

export class RoomWsService extends BaseWsService {
    private roomService: RoomService;
    private rooms = new Map<string, Map<string, Participant>>();

    constructor() {
        super();
        this.roomService = new RoomService();
    }

    initRoom() {
        return async (ws: WebSocket, req: Request) => {
            try {
                const { code } = req.params;

                const room = await this.roomService.getRoomByCode(code);

                if (!room) {
                    this.sendError(ws, "Room not found");
                    ws.close();
                    return;
                }

                ws.on("message", async (msg) => {});

                ws.on("error", (e) => {
                    console.error(e);
                });

                ws.on("close", async () => {});
            } catch (e) {
                console.error(e);
                this.sendError(ws, "Internal server error");
                ws.close();
            }
        };
    }
}

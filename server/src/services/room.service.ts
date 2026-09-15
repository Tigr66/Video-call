import { nanoid } from "nanoid";
import { RoomRepository } from "../repositories/room.repository";
import { Room } from "../types/room.types";

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }

    async createRoom(): Promise<Room> {
        const code = nanoid(6);
        return await this.roomRepository.createRoom(code);
    }

    async getRoomByCode(code: string): Promise<Room | null> {
        return await this.roomRepository.getRoomByCode(code);
    }
}

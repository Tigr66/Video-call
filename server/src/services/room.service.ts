import { RoomRepository } from "../repositories/room.repository";
import { Room } from "../types/room.types";
import { generateRoomCode } from "../utils/generate-room-code.util";

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }

    async createRoom(): Promise<Room> {
        const code = generateRoomCode().toUpperCase();
        return await this.roomRepository.createRoom(code);
    }

    async getRoomByCode(code: string): Promise<Room | null> {
        return await this.roomRepository.getRoomByCode(code.toUpperCase());
    }
}

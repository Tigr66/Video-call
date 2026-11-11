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

    async deleteRoomByCode(code: string): Promise<Room | null> {
        return await this.roomRepository.deleteRoomByCode(code.toUpperCase());
    }

    async activateRoomByCode(code: string): Promise<Room | null> {
        return await this.roomRepository.activateRoomByCode(code.toUpperCase());
    }   

    async deactivateRoomByCode(code: string): Promise<Room | null> {
        return await this.roomRepository.deactivateRoomByCode(code.toUpperCase());
    }

    async getExpiredInactiveRooms(): Promise<Room[]> {
        return await this.roomRepository.getExpiredInactiveRooms();
    } 
}

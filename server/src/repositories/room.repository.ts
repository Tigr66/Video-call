import { Room } from "../types/room.types";
import { BaseRepository } from "./base.repository";

export class RoomRepository extends BaseRepository {
    async createRoom(code: string): Promise<Room> {
        try {
            return await this.models.Room.create({ code });
        } catch (e) {
            this.handleError(e, "Ошибка при создании комнаты");
        }
    }

    async getRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.first({ code });
        } catch (e) {
            this.handleError(e, `Ошибка при получении комнаты с кодом ${code}`);
        }
    }
}

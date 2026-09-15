import { Room } from "../types/room.types";
import { BaseRepository } from "./base.repository";

export class RoomRepository extends BaseRepository {
    async createRoom(code: string): Promise<Room> {
        try {
            return await this.models.Room.create({ code });
        } catch (e) {
            this.handleError(e, "Failed to create room");
        }
    }

    async getRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.first({ code });
        } catch (e) {
            this.handleError(e, `Failed to get room with code ${code}`);
        }
    }
}

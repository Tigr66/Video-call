import { Temporal } from "temporal-polyfill/full/implementation";
import { Room } from "../types/room.types";
import { BaseRepository } from "./base.repository";

export class RoomRepository extends BaseRepository {
    async createRoom(code: string): Promise<Room> {
        try {
            return await this.models.Room.create({
                code,
                inactiveAt: Temporal.Now.instant(),
            });
        } catch (e) {
            this.handleError(e, "Ошибка при создании комнаты");
        }
    }

    async getExpiredInactiveRooms(): Promise<Room[]> {
        try {
            const expirationDate = Temporal.Now.instant().subtract({
                minutes: 30,
            });

            return await this.models.Room.where({ isActive: false })
                .where((room) => room.inactiveAt.lte(expirationDate))
                .orderBy((room) => room.inactiveAt.asc())
                .all();
        } catch (e) {
            this.handleError(e, "Ошибка при получении неактивных комнат");
        }
    }

    async getRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.first({ code });
        } catch (e) {
            this.handleError(e, `Ошибка при получении комнаты с кодом ${code}`);
        }
    }

    async deleteRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.where({ code }).delete();
        } catch (e) {
            this.handleError(e, `Ошибка при удалении комнаты с кодом ${code}`);
        }
    }

    async activateRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.where({ code }).update({
                inactiveAt: null,
                isActive: true,
            });
        } catch (e) {
            this.handleError(e, `Ошибка при активации комнаты с кодом ${code}`);
        }
    }

    async deactivateRoomByCode(code: string): Promise<Room | null> {
        try {
            return await this.models.Room.where({ code }).update({
                inactiveAt: Temporal.Now.instant(),
                isActive: false,
            });
        } catch (e) {
            this.handleError(
                e,
                `Ошибка при деактивации комнаты с кодом ${code}`,
            );
        }
    }
}

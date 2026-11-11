import { CLEANUP_ROOMS_CONFIG } from "../config/cleanup-room.config";
import { RoomService } from "../services/room.service";
import cron from "node-cron";

const roomService = new RoomService();

export const startCleanupRoomsJob = () => {
    cron.schedule(
        CLEANUP_ROOMS_CONFIG.cron,
        async () => {
            try {
                const rooms = await roomService.getExpiredInactiveRooms();

                for (const room of rooms) {
                    try {
                        await roomService.deleteRoomByCode(room.code);
                    } catch (e) {
                        console.error(
                            `Ошибка удаления комнаты ${room.code}:`,
                            e,
                        );
                    }
                }
            } catch (e) {
                console.error("Ошибка удаления комнат", e);
            }
        },
        {
            timezone: CLEANUP_ROOMS_CONFIG.timezone,
        },
    );
};

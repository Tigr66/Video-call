import { setupApp } from "./app";
import { startCleanupRoomsJob } from "./jobs/cleanup-rooms.job";

const PORT = Number(process.env.PORT) || 8000;

const bootstrap = async () => {
    const app = setupApp();

    startCleanupRoomsJob();

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

bootstrap();

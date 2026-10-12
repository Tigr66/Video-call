import { setupApp } from "./app";

const PORT = Number(process.env.PORT) || 8000;

const bootstrap = async () => {
    const app = setupApp();

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

bootstrap();

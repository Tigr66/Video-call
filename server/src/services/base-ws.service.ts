import WebSocket, { WebSocketServer } from "ws";

export abstract class BaseWsService {
    protected sendError(ws: WebSocket, message: string) {
        ws.send(
            JSON.stringify({
                type: "error",
                message,
            }),
        );
    }
}

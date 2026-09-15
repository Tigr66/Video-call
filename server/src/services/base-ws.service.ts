import WebSocket, { WebSocketServer } from "ws";

export abstract class BaseWsService {
    protected wss: WebSocketServer;

    constructor(wss: WebSocketServer) {
        this.wss = wss;
    }

    protected sendError(ws: WebSocket, message: string) {
        ws.send(
            JSON.stringify({
                type: "error",
                message,
            }),
        );
    }
}

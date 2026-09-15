import WebSocket from "ws";

export type Participant = {
    id: string;
    name: string;
    ws: WebSocket;
};

import WebSocket from "ws";
import { Request } from "express";
import { Participant, RoomMessage } from "../types/room-ws.types";
import { BaseWsService } from "./base-ws.service";
import { RoomService } from "./room.service";
import { nanoid } from "nanoid";

export class RoomWsService extends BaseWsService {
    private roomService: RoomService;
    private rooms = new Map<string, Map<string, Participant>>();

    constructor() {
        super();
        this.roomService = new RoomService();
    }

    initRoom() {
        return async (ws: WebSocket, req: Request) => {
            try {
                const { code } = req.params;

                if (typeof code !== "string") {
                    this.sendError(ws, "Код должен быть строкой");
                    ws.close();
                    return;
                }

                const room = await this.roomService.getRoomByCode(code);

                if (!room) {
                    this.sendError(ws, "Комната не найдена");
                    ws.close();
                    return;
                }

                const peerId = nanoid(32);

                ws.on("message", async (msg) => {
                    const data: RoomMessage = JSON.parse(msg.toString());

                    if (data.type === "join") {
                        this.joinRoom(code, peerId, data.name, ws);
                    }

                    if (data.type === "offer") {
                        this.handleOffer(
                            code,
                            data.targetPeerId,
                            peerId,
                            data.offer,
                        );
                    }

                    if (data.type === "answer") {
                        this.handleAnswer(
                            code,
                            data.targetPeerId,
                            peerId,
                            data.answer,
                        );
                    }

                    if (data.type === "ice_candidate") {
                        this.handleIceCandidate(
                            code,
                            data.targetPeerId,
                            peerId,
                            data.candidate,
                        );
                    }
                });

                ws.on("error", (e) => {
                    console.error(e);
                });

                ws.on("close", async () => {
                    this.leaveRoom(code, peerId);
                });
            } catch (e) {
                console.error(e);
                this.sendError(ws, "Внутренняя ошибка сервера");
                ws.close();
            }
        };
    }

    private joinRoom(
        code: string,
        peerId: string,
        name: string,
        ws: WebSocket,
    ) {
        let participants = this.getParticipants(code);

        if (!participants) {
            participants = new Map<string, Participant>();
            this.rooms.set(code, participants);
        }

        if (participants.size >= 4) {
            this.sendError(ws, "Комната заполнена. Максимум 4 участника");
            ws.close();
            return;
        }

        participants.forEach((participant) => {
            participant.ws.send(
                JSON.stringify({
                    type: "new_participant",
                    peerId,
                    name,
                }),
            );
        });

        const existingParticipants = [...participants.values()].map(
            ({ peerId, name }) => ({ peerId, name }),
        );

        ws.send(
            JSON.stringify({
                type: "existing_participants",
                participants: existingParticipants,
            }),
        );

        participants.set(peerId, { peerId, name, ws });
    }

    private leaveRoom(code: string, peerId: string) {
        const participants = this.getParticipants(code);

        if (!participants) return;

        const participant = participants.get(peerId);

        if (!participant) return;

        participants.delete(peerId);

        participants.forEach((p) => {
            p.ws.send(
                JSON.stringify({
                    type: "participant_left",
                    peerId,
                }),
            );
        });

        if (participants.size === 0) {
            this.rooms.delete(code);
        }
    }

    private handleOffer(
        code: string,
        targetPeerId: string,
        fromPeerId: string,
        offer: RTCSessionDescriptionInit,
    ) {
        const participants = this.getParticipants(code);

        if (!participants) return;

        const participant = participants.get(targetPeerId);

        if (!participant) return;

        participant.ws.send(
            JSON.stringify({
                type: "offer",
                fromPeerId,
                offer,
            }),
        );
    }

    private handleAnswer(
        code: string,
        targetPeerId: string,
        fromPeerId: string,
        answer: RTCSessionDescriptionInit,
    ) {
        const participants = this.getParticipants(code);

        if (!participants) return;

        const participant = participants.get(targetPeerId);

        if (!participant) return;

        participant.ws.send(
            JSON.stringify({
                type: "answer",
                fromPeerId,
                answer,
            }),
        );
    }

    private handleIceCandidate(
        code: string,
        targetPeerId: string,
        fromPeerId: string,
        candidate: RTCIceCandidateInit,
    ) {
        const participants = this.getParticipants(code);

        if (!participants) return;

        const participant = participants.get(targetPeerId);

        if (!participant) return;

        participant.ws.send(
            JSON.stringify({
                type: "ice_candidate",
                fromPeerId,
                candidate,
            }),
        );
    }

    private getParticipants(code: string) {
        return this.rooms.get(code);
    }
}

import WebSocket from "ws";
import { Request } from "express";
import {
    Participant,
    RoomIncomingMessage,
    RoomOutgoingMessage,
} from "../types/room-ws.types";
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

                const roomPromise = this.roomService.getRoomByCode(code);

                const peerId = nanoid(32);

                ws.on("message", async (msg) => {
                    const room = await roomPromise;

                    if (!room || ws.readyState !== WebSocket.OPEN) return;

                    await this.handleMessage(code, peerId, ws, msg);
                });

                const room = await roomPromise;

                if (!room) {
                    this.sendError(ws, "Комната не найдена");
                    ws.close();
                    return;
                }

                ws.on("error", (e) => {
                    console.error(e);
                });

                ws.on("close", async () => {
                    await this.leaveRoom(code, peerId);
                });
            } catch (e) {
                console.error(e);
                this.sendError(ws, "Внутренняя ошибка сервера");
                ws.close();
            }
        };
    }

    private async joinRoom(
        code: string,
        peerId: string,
        name: string,
        ws: WebSocket,
    ) {
        let participants = this.getParticipants(code);

        if (!participants) {
            participants = new Map<string, Participant>();
            this.rooms.set(code, participants);

            await this.roomService.activateRoomByCode(code);
        }

        if (participants.has(peerId)) return;

        if (participants.size >= 4) {
            this.sendError(ws, "Комната заполнена. Максимум 4 участника");
            ws.close();
            return;
        }

        participants.forEach((p) => {
            this.sendToParticipant(p, {
                type: "new_participant",
                peerId,
                name,
            });
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

    private async leaveRoom(code: string, peerId: string) {
        const participants = this.getParticipants(code);

        if (!participants) return;

        const participant = participants.get(peerId);

        if (!participant) return;

        participants.delete(peerId);

        participants.forEach((p) => {
            this.sendToParticipant(p, {
                type: "participant_left",
                peerId,
                name: participant.name,
            });
        });

        if (participants.size === 0) {
            this.rooms.delete(code);

            await this.roomService.deactivateRoomByCode(code);
        }
    }

    private async handleMessage(
        code: string,
        peerId: string,
        ws: WebSocket,
        msg: WebSocket.RawData,
    ) {
        try {
            const data: RoomIncomingMessage = JSON.parse(msg.toString());

            switch (data.type) {
                case "join":
                    await this.joinRoom(code, peerId, data.name, ws);
                    break;

                case "offer":
                    if (!this.isParticipant(code, peerId)) return;
                    this.handleOffer(
                        code,
                        data.targetPeerId,
                        peerId,
                        data.offer,
                    );
                    break;

                case "answer":
                    if (!this.isParticipant(code, peerId)) return;
                    this.handleAnswer(
                        code,
                        data.targetPeerId,
                        peerId,
                        data.answer,
                    );
                    break;

                case "ice_candidate":
                    if (!this.isParticipant(code, peerId)) return;
                    this.handleIceCandidate(
                        code,
                        data.targetPeerId,
                        peerId,
                        data.candidate,
                    );
                    break;
            }
        } catch (e) {
            console.error("Ошибка:", e);
            if (ws.readyState === WebSocket.OPEN) {
                this.sendError(ws, "Не удалось обработать сообщение");
            }
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

        this.sendToParticipant(participant, {
            type: "offer",
            fromPeerId,
            offer,
        });
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

        this.sendToParticipant(participant, {
            type: "answer",
            fromPeerId,
            answer,
        });
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

        this.sendToParticipant(participant, {
            type: "ice_candidate",
            fromPeerId,
            candidate,
        });
    }

    private sendToParticipant(
        participant: Participant,
        message: RoomOutgoingMessage,
    ) {
        if (participant.ws.readyState !== WebSocket.OPEN) return;

        participant.ws.send(JSON.stringify(message));
    }

    private getParticipants(code: string) {
        return this.rooms.get(code);
    }

    private isParticipant(code: string, peerId: string) {
        return this.getParticipants(code)?.has(peerId) ?? false;
    }
}

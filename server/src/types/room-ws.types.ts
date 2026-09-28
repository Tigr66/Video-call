import WebSocket from "ws";

export interface Participant {
    peerId: string;
    name: string;
    ws: WebSocket;
}

export interface JoinMessage {
    type: "join";
    name: string;
}

export interface OfferMessage {
    type: "offer";
    targetPeerId: string;
    offer: RTCSessionDescriptionInit;
}

export interface AnswerMessage {
    type: "answer";
    targetPeerId: string;
    answer: RTCSessionDescriptionInit;
}

export interface IceCandidateMessage {
    type: "ice_candidate";
    targetPeerId: string;
    candidate: RTCIceCandidateInit;
}

export type RoomMessage =
    JoinMessage | OfferMessage | AnswerMessage | IceCandidateMessage;

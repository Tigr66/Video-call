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

export type RoomIncomingMessage =
    JoinMessage | OfferMessage | AnswerMessage | IceCandidateMessage;

export interface OfferOutgoingMessage {
    type: "offer";
    fromPeerId: string;
    offer: RTCSessionDescriptionInit;
}

export interface AnswerOutgoingMessage {
    type: "answer";
    fromPeerId: string;
    answer: RTCSessionDescriptionInit;
}

export interface IceCandidateOutgoingMessage {
    type: "ice_candidate";
    fromPeerId: string;
    candidate: RTCIceCandidateInit;
}

export interface ParticipantLeftOutgoingMessage {
    type: "participant_left";
    peerId: string;
    name: string;
}

export interface NewParticipantOutgoingMessage {
    type: "new_participant";
    peerId: string;
    name: string;
}

export interface ExistingParticipantsOutgoingMessage {
    type: "existing_participants";
    participants: Participant[];
}

export type RoomOutgoingMessage =
    | ParticipantLeftOutgoingMessage
    | NewParticipantOutgoingMessage
    | ExistingParticipantsOutgoingMessage
    | OfferOutgoingMessage
    | AnswerOutgoingMessage
    | IceCandidateOutgoingMessage;

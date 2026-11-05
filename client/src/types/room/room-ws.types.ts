export type Participant = {
    peerId: string;
    name: string;
    stream?: MediaStream | null;
};

export interface ExistingParticipantsMessage {
    type: "existing_participants";
    participants: Participant[];
}

export interface NewParticipantMessage {
    type: "new_participant";
    peerId: string;
    name: string;
}

export interface ParticipantLeftMessage {
    type: "participant_left";
    peerId: string;
    name: string;
}

export interface OfferMessage {
    type: "offer";
    fromPeerId: string;
    offer: RTCSessionDescriptionInit;
}

export interface AnswerMessage {
    type: "answer";
    fromPeerId: string;
    answer: RTCSessionDescriptionInit;
}

export interface IceCandidateMessage {
    type: "ice_candidate";
    fromPeerId: string;
    candidate: RTCIceCandidateInit;
}

export interface ErrorMessage {
    type: "error";
    message: string;
}

export type RoomWsMessage =
    | ExistingParticipantsMessage
    | NewParticipantMessage
    | ParticipantLeftMessage
    | OfferMessage
    | AnswerMessage
    | IceCandidateMessage
    | ErrorMessage;

export interface JoinMessage {
    type: "join";
    name: string;
}

export interface OfferOutgoingMessage {
    type: "offer";
    targetPeerId: string;
    offer: RTCSessionDescriptionInit;
}

export interface AnswerOutgoingMessage {
    type: "answer";
    targetPeerId: string;
    answer: RTCSessionDescriptionInit;
}

export interface IceCandidateOutgoingMessage {
    type: "ice_candidate";
    targetPeerId: string;
    candidate: RTCIceCandidateInit;
}

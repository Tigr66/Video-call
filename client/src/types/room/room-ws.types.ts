export type Participant = {
    peerId: string;
    name: string;
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

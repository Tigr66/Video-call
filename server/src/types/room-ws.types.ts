import WebSocket from "ws";

export type Participant = {
    peerId: string;
    name: string;
    ws: WebSocket;
};

export type RoomMessage =
    | {
          type: "join";
          name: string;
      }
    | {
          type: "offer";
          targetPeerId: string;
          offer: RTCSessionDescriptionInit;
      }
    | {
          type: "answer";
          targetPeerId: string;
          answer: RTCSessionDescriptionInit;
      }
    | {
          type: "ice_candidate";
          targetPeerId: string;
          candidate: RTCIceCandidateInit;
      };

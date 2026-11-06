import { ICE_SERVERS, WS_URL } from "@/api/video-call-api";
import { appRoutes } from "@/routes/app-routes";
import { notifyError, notifyInfo } from "@/services/notify.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRoomByCodeThunk } from "@/store/room-slice/room-thunks";
import type {
    IceCandidateOutgoingMessage,
    JoinMessage,
    Participant,
    RoomWsMessage,
} from "@/types/room/room-ws.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const errorMessage =
    "Ошибка соединения с участником комнаты, попробуйте перезагрузить страницу";

const useRoomPage = (code?: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { currentRoomCode, isLoading } = useAppSelector(
        (state) => state.room,
    );

    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [hasCheckedRoom, setHasCheckedRoom] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [participants, setParticipants] = useState<Participant[]>([]);

    const localStream = useRef<MediaStream | null>(null);
    const peerConnections = useRef(new Map<string, RTCPeerConnection>());
    const socket = useRef<WebSocket | null>(null);

    const createPeerConnection = (toPeerId: string): RTCPeerConnection => {
        const existingConnection = peerConnections.current.get(toPeerId);

        if (existingConnection) {
            return existingConnection;
        }

        const peerConnection = new RTCPeerConnection({
            iceServers: ICE_SERVERS,
        });

        peerConnections.current.set(toPeerId, peerConnection);

        peerConnection.onicecandidate = (event) => {
            const candidate = event.candidate;

            if (candidate) {
                const iceCandidateMessage: IceCandidateOutgoingMessage = {
                    type: "ice_candidate",
                    targetPeerId: toPeerId,
                    candidate,
                };

                socket.current?.send(JSON.stringify(iceCandidateMessage));
            }
        };

        peerConnection.ontrack = (event) => {
            const stream = event.streams[0];

            if (!stream) return;

            setParticipants((prev) =>
                prev.map((p) => (p.peerId === toPeerId ? { ...p, stream } : p)),
            );
        };

        return peerConnection;
    };

    const createSessionDescription = async (
        toPeerId: string,
        type: "offer" | "answer",
    ): Promise<RTCSessionDescriptionInit | null> => {
        try {
            const pc = createPeerConnection(toPeerId);

            const stream = localStream.current;

            stream?.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });

            const sessionDescription =
                type === "offer"
                    ? await pc.createOffer()
                    : await pc.createAnswer();

            await pc.setLocalDescription(sessionDescription);

            return sessionDescription;
        } catch (error) {
            notifyError(errorMessage);
            return null;
        }
    };

    const onReady = (stream: MediaStream, name: string) => {
        localStream.current = stream;
        setUserName(name);
        setHasJoined(true);
    };

    const cleanUp = useCallback(() => {}, [localStream]);

    const endCall = () => {
        cleanUp();
        setHasJoined(false);
        localStream.current = null;
        navigate(appRoutes.HOME_PAGE);
    };

    const onOpenSocket = () => {
        const joinMessage: JoinMessage = {
            type: "join",
            name: userName,
        };

        socket.current?.send(JSON.stringify(joinMessage));
    };

    const onSocketMessage = async (event: MessageEvent) => {
        const data: RoomWsMessage = JSON.parse(event.data);

        if (data.type === "error") {
            notifyError(data.message);
        }

        if (data.type === "existing_participants") {
        }

        if (data.type === "new_participant") {
            setParticipants((prev) => [
                ...prev,
                { peerId: data.peerId, name: data.name },
            ]);

            notifyInfo(`${data.name} присоединился к комнате`);
        }

        if (data.type === "participant_left") {
            notifyInfo(`${data.name} покинул комнату`);
        }

        if (data.type === "offer") {
        }

        if (data.type === "answer") {
        }

        if (data.type === "ice_candidate") {
        }
    };

    const onErrorSocket = () => {
        notifyError("Ошибка соединения с сервером");
    };

    useEffect(() => {
        if (code) {
            dispatch(getRoomByCodeThunk(code)).finally(() => {
                setHasCheckedRoom(true);
            });
        }
    }, [dispatch, code]);

    useEffect(() => {
        if (!hasJoined || !code) return;

        socket.current = new WebSocket(`${WS_URL}/rooms/${code}`);

        socket.current.onopen = onOpenSocket;

        socket.current.onmessage = onSocketMessage;

        socket.current.onerror = onErrorSocket;

        return () => {
            cleanUp();
        };
    }, [hasJoined, code, cleanUp]);

    const roomNotFound =
        hasCheckedRoom && !isLoading && currentRoomCode !== code;

    const renderJoinModal = hasCheckedRoom && !hasJoined && !roomNotFound;

    return {
        remoteStreams,
        participants,
        hasJoined,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
        isLoading,
        endCall,
    };
};

export default useRoomPage;

import { ICE_SERVERS, WS_URL } from "@/api/video-call-api";
import { appRoutes } from "@/routes/app-routes";
import { notifyError, notifyInfo } from "@/services/notify.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRoomByCodeThunk } from "@/store/room-slice/room-thunks";
import type {
    AnswerMessage,
    AnswerOutgoingMessage,
    ErrorMessage,
    ExistingParticipantsMessage,
    IceCandidateMessage,
    IceCandidateOutgoingMessage,
    JoinMessage,
    NewParticipantMessage,
    OfferMessage,
    OfferOutgoingMessage,
    Participant,
    ParticipantLeftMessage,
    RoomWsMessage,
} from "@/types/room/room-ws.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserName from "@/hooks/useUserName";

const errorMessage =
    "Ошибка соединения с участником комнаты, попробуйте перезагрузить страницу";

const useRoomPage = (code?: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { saveUserName } = useUserName();

    const { isLoading } = useAppSelector((state) => state.room);

    const [roomFound, setRoomFound] = useState<boolean>(false);
    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [hasCheckedRoom, setHasCheckedRoom] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [participants, setParticipants] = useState<Participant[]>([]);

    const localStream = useRef<MediaStream | null>(null);
    const peerConnections = useRef(new Map<string, RTCPeerConnection>());
    const pendingCandidates = useRef(new Map<string, RTCIceCandidateInit[]>());
    const socket = useRef<WebSocket | null>(null);

    const getPeerConnectionById = (
        id: string,
    ): RTCPeerConnection | undefined => {
        return peerConnections.current.get(id);
    };

    const getCandidatesById = (
        id: string,
    ): RTCIceCandidateInit[] | undefined => {
        return pendingCandidates.current.get(id);
    };

    const flushPendingCandidates = async (id: string) => {
        try {
            const pc = getPeerConnectionById(id);

            const candidates = getCandidatesById(id);

            if (!pc || !candidates?.length) return;

            for (const candidate of candidates) {
                await pc.addIceCandidate(candidate);
            }

            pendingCandidates.current.delete(id);
        } catch {
            notifyError(errorMessage);
        }
    };

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
                const alreadyAdded = pc
                    .getSenders()
                    .some((sender) => sender.track === track);

                if (!alreadyAdded) {
                    pc.addTrack(track, stream);
                }
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

    const handleReady = (stream: MediaStream, name: string) => {
        localStream.current = stream;
        setUserName(name);
        saveUserName(name);
        setHasJoined(true);
    };

    const onOpenSocket = () => {
        const joinMessage: JoinMessage = {
            type: "join",
            name: userName,
        };

        socket.current?.send(JSON.stringify(joinMessage));
    };

    const endCall = () => {
        cleanUp();
        setHasJoined(false);
        localStream.current = null;
        navigate(appRoutes.HOME_PAGE);
    };

    const cleanUp = useCallback(() => {
        socket.current?.close();
        socket.current = null;

        peerConnections.current.forEach((pc) => pc.close());
        peerConnections.current.clear();

        pendingCandidates.current.clear();

        localStream.current?.getTracks().forEach((track) => track.stop());

        setParticipants([]);
    }, []);

    const handleError = (data: ErrorMessage) => {
        notifyError(data.message);
    };

    const handleExistingParticipants = async (
        data: ExistingParticipantsMessage,
    ) => {
        setParticipants(data.participants);

        for (const participant of data.participants) {
            const offer = await createSessionDescription(
                participant.peerId,
                "offer",
            );

            if (!offer) continue;

            const offerMessage: OfferOutgoingMessage = {
                type: "offer",
                targetPeerId: participant.peerId,
                offer,
            };

            socket.current?.send(JSON.stringify(offerMessage));
        }
    };

    const handleNewParticipant = (data: NewParticipantMessage) => {
        setParticipants((prev) => [
            ...prev,
            { peerId: data.peerId, name: data.name },
        ]);

        notifyInfo(`${data.name} присоединился к комнате`);
    };

    const handleParticipantLeft = (data: ParticipantLeftMessage) => {
        peerConnections.current.get(data.peerId)?.close();
        peerConnections.current.delete(data.peerId);

        pendingCandidates.current.delete(data.peerId);

        setParticipants((prev) => prev.filter((p) => p.peerId !== data.peerId));

        notifyInfo(`${data.name} покинул комнату`);
    };

    const handleIncomingOffer = async (data: OfferMessage) => {
        try {
            const pc = createPeerConnection(data.fromPeerId);

            await pc.setRemoteDescription(data.offer);

            await flushPendingCandidates(data.fromPeerId);

            const answer = await createSessionDescription(
                data.fromPeerId,
                "answer",
            );

            if (!answer) return;

            const answerMessage: AnswerOutgoingMessage = {
                type: "answer",
                targetPeerId: data.fromPeerId,
                answer,
            };

            socket.current?.send(JSON.stringify(answerMessage));
        } catch {
            notifyError(errorMessage);
        }
    };

    const handleIncomingAnswer = async (data: AnswerMessage) => {
        try {
            const pc = getPeerConnectionById(data.fromPeerId);

            if (pc) {
                await pc.setRemoteDescription(data.answer);
                await flushPendingCandidates(data.fromPeerId);
            }
        } catch {
            notifyError(errorMessage);
        }
    };

    const handleIncomingIceCandidate = async (data: IceCandidateMessage) => {
        try {
            const pc = getPeerConnectionById(data.fromPeerId);

            if (pc?.remoteDescription) {
                await pc.addIceCandidate(data.candidate);
                return;
            }

            const candidates = getCandidatesById(data.fromPeerId);

            if (candidates) {
                candidates.push(data.candidate);
            } else {
                pendingCandidates.current.set(data.fromPeerId, [
                    data.candidate,
                ]);
            }
        } catch {
            notifyError(errorMessage);
        }
    };

    const onSocketMessage = async (event: MessageEvent) => {
        try {
            const data: RoomWsMessage = JSON.parse(event.data);

            switch (data.type) {
                case "error":
                    handleError(data);
                    break;

                case "existing_participants":
                    await handleExistingParticipants(data);
                    break;

                case "new_participant":
                    handleNewParticipant(data);
                    break;

                case "participant_left":
                    handleParticipantLeft(data);
                    break;

                case "offer":
                    await handleIncomingOffer(data);
                    break;

                case "answer":
                    await handleIncomingAnswer(data);
                    break;

                case "ice_candidate":
                    await handleIncomingIceCandidate(data);
                    break;
            }
        } catch {
            notifyError(errorMessage);
        }
    };

    const onErrorSocket = () => {
        notifyError("Ошибка соединения с сервером");
    };

    useEffect(() => {
        if (code) {
            dispatch(getRoomByCodeThunk(code))
                .then(() => {
                    setRoomFound(true);
                })
                .catch(() => {
                    setRoomFound(false);
                })
                .finally(() => {
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

    const roomNotFound = hasCheckedRoom && !isLoading && !roomFound;

    const renderJoinModal = hasCheckedRoom && !hasJoined && !roomNotFound;

    const showRoomCode =
        hasCheckedRoom &&
        !isLoading &&
        !renderJoinModal &&
        !roomNotFound &&
        code;

    const displayedParticipantCount =
        participants.length + (localStream.current ? 1 : 0);

    return {
        participants,
        hasJoined,
        localStream,
        userName,
        roomNotFound,
        renderJoinModal,
        showRoomCode,
        isLoading,
        displayedParticipantCount,
        handleReady,
        endCall,
    };
};

export default useRoomPage;

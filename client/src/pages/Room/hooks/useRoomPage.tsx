import { ICE_SERVERS, WS_URL } from "@/api/video-call-api";
import { notifyError, notifyInfo } from "@/services/notify.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRoomByCodeThunk } from "@/store/room-slice/room-thunks";
import type { Participant, RoomWsMessage } from "@/types/room/room-ws.types";
import { useEffect, useRef, useState } from "react";

const useRoomPage = (code?: string) => {
    const dispatch = useAppDispatch();

    const { currentRoomCode, isLoading } = useAppSelector(
        (state) => state.room,
    );

    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [hasCheckedRoom, setHasCheckedRoom] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const peerConnections = useRef(new Map<string, RTCPeerConnection>());

    const socket = useRef<WebSocket | null>(null);

    const createPeerConnection = (peerId: string) => {
        const pc = new RTCPeerConnection({
            iceServers: ICE_SERVERS,
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current?.send(
                    JSON.stringify({
                        type: "ice_candidate",
                        targetPeerId: peerId,
                        candidate: event.candidate,
                    }),
                );
            }
        };

        peerConnections.current.set(peerId, pc);

        return pc;
    };

    const onReady = (stream: MediaStream, name: string) => {
        setLocalStream(stream);
        setUserName(name);
        setHasJoined(true);
    };

    const createOffer = async (peerId: string) => {
        const pc = createPeerConnection(peerId);

        localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);

        return offer;
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

        const socket = new WebSocket(`${WS_URL}/rooms/${code}`);

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    type: "join",
                    name: userName,
                }),
            );
        };

        socket.onmessage = async (event) => {
            const data: RoomWsMessage = JSON.parse(event.data);

            if (data.type === "error") {
                notifyError(data.message);
            }

            if (data.type === "existing_participants") {
                setParticipants(data.participants);

                for (const participant of data.participants) {
                    const offer = await createOffer(participant.peerId);

                    socket.send(
                        JSON.stringify({
                            type: "offer",
                            targetPeerId: participant.peerId,
                            offer: offer,
                        }),
                    );
                }
            }

            if (data.type === "new_participant") {
                setParticipants((prev) => [
                    ...prev,
                    { peerId: data.peerId, name: data.name },
                ]);

                notifyInfo(`${data.name} присоединился к комнате`);
            }

            if (data.type === "participant_left") {
                setParticipants((prev) =>
                    prev.filter((p) => p.peerId !== data.peerId),
                );

                notifyInfo(`${data.name} покинул комнату`);
            }

            if (data.type === "offer") {
                const pc = createPeerConnection(data.fromPeerId);

                localStream?.getTracks().forEach((track) => {
                    pc.addTrack(track, localStream);
                });

                await pc.setRemoteDescription(data.offer);

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.send(
                    JSON.stringify({
                        type: "answer",
                        targetPeerId: data.fromPeerId,
                        answer: answer,
                    }),
                );
            }

            if (data.type === "answer") {
                const pc = peerConnections.current.get(data.fromPeerId);

                if (pc) await pc.setRemoteDescription(data.answer);
            }

            if (data.type === "ice_candidate") {
                const pc = peerConnections.current.get(data.fromPeerId);

                if (pc) await pc.addIceCandidate(data.candidate);
            }
        };

        socket.onerror = () => {
            notifyError("Ошибка соединения с сервером");
        };

        return () => {
            socket.close();
        };
    }, [hasJoined, code]);

    const roomNotFound =
        hasCheckedRoom && !isLoading && currentRoomCode !== code;

    const renderJoinModal = hasCheckedRoom && !hasJoined && !roomNotFound;

    return {
        hasJoined,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
        isLoading,
    };
};

export default useRoomPage;

import { WS_URL } from "@/api/video-call-api";
import { notifyError } from "@/services/notify.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRoomByCodeThunk } from "@/store/room-slice/room-thunks";
import { useEffect, useState } from "react";

const useRoomPage = (code?: string) => {
    const dispatch = useAppDispatch();

    const { currentRoomCode, isLoading } = useAppSelector(
        (state) => state.room,
    );

    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [hasCheckedRoom, setHasCheckedRoom] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const onReady = (stream: MediaStream, name: string) => {
        setLocalStream(stream);
        setUserName(name);
        setHasJoined(true);
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

        socket.onmessage = (event) => {
            console.log("Message:", event.data);
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

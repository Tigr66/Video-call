import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRoomByCodeThunk } from "@/store/room-slice/room-thunks";
import { useEffect, useState } from "react";

const useRoomPage = (code?: string) => {
    const dispatch = useAppDispatch();

    const { currentRoomCode, isLoading } = useAppSelector(
        (state) => state.room,
    );

    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const onReady = (stream: MediaStream, name: string) => {
        setLocalStream(stream);
        setUserName(name);
        setHasJoined(true);
    };

    useEffect(() => {
        if (code) {
            dispatch(getRoomByCodeThunk(code));
        }
    }, [dispatch, code]);

    const roomNotFound = !isLoading && currentRoomCode !== code;

    const renderJoinModal = !hasJoined && !roomNotFound;

    return {
        hasJoined,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
    };
};

export default useRoomPage;

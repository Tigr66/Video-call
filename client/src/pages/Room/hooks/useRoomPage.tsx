import { useState } from "react";

const useRoomPage = () => {
    const [hasJoined, setHasJoined] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const onReady = (stream: MediaStream, name: string) => {
        setLocalStream(stream);
        setUserName(name);
        setHasJoined(true);
    };

    return {
        hasJoined,
        localStream,
        userName,
        onReady,
    };
};

export default useRoomPage;

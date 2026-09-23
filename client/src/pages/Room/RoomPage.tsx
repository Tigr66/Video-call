import { useParams } from "react-router-dom";
import useRoomPage from "./hooks/useRoomPage";
import { JoinRoomModal } from "./components";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const { hasJoined, localStream, userName, onReady } = useRoomPage();

    if (!hasJoined) return <JoinRoomModal onReady={onReady} />;

    return null;
};

export default RoomPage;

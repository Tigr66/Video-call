import { useParams } from "react-router-dom";
import { JoinRoomModal } from "./components";
import useRoomPage from "./hooks/useRoomPage";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const { hasJoined, localStream, userName, onReady } = useRoomPage();

    return (
        <div
            className="min-h-screen
                bg-[linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab)]
                bg-size-[400%_400%]
                animate-gradient"
        >
            {!hasJoined && <JoinRoomModal onReady={onReady} />}
        </div>
    );
};

export default RoomPage;

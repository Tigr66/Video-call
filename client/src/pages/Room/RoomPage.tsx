import { useParams } from "react-router-dom";
import { JoinRoomModal } from "./components";
import useRoomPage from "./hooks/useRoomPage";
import NotFoundRoom from "./components/NotFoundRoom";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const {
        hasJoined,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
    } = useRoomPage(code);

    return (
        <div
            className="min-h-screen
                bg-[linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab)]
                bg-size-[400%_400%]
                animate-gradient"
        >
            {renderJoinModal && <JoinRoomModal onReady={onReady} />}
            {roomNotFound && <NotFoundRoom />}
        </div>
    );
};

export default RoomPage;

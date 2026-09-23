import { useParams } from "react-router-dom";
import { JoinRoomModal, NotFoundRoom } from "./components";
import { LoaderCircle } from "lucide-react";
import useRoomPage from "./hooks/useRoomPage";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const {
        hasJoined,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
        isLoading,
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
            {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-screen gap-1">
                    <LoaderCircle className="h-16 w-16 animate-spin text-white" />
                    <h2 className="text-white text-xl">Загрузка комнаты...</h2>
                </div>
            )}
        </div>
    );
};

export default RoomPage;

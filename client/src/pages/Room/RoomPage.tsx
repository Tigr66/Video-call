import { useParams } from "react-router-dom";
import { JoinRoomModal, NotFoundRoom, Video } from "./components";
import { LoaderCircle, PhoneOff } from "lucide-react";
import useRoomPage from "./hooks/useRoomPage";
import "./styles.css";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const {
        participants,
        localStream,
        userName,
        roomNotFound,
        renderJoinModal,
        isLoading,
        hasJoined,
        displayedParticipantCount,
        endCall,
        handleReady,
    } = useRoomPage(code);

    return (
        <div
            className="flex flex-col gap-1 items-center h-screen min-h-0 overflow-hidden
                bg-[linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab)]
                bg-size-[400%_400%]
                animate-gradient sm:p-3"
        >
            {renderJoinModal && <JoinRoomModal onReady={handleReady} />}
            {roomNotFound && <NotFoundRoom />}
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-1 h-screen">
                    <LoaderCircle className="h-16 w-16 animate-spin text-white" />
                    <h2 className="text-white text-xl">Загрузка комнаты...</h2>
                </div>
            )}

            <div className="video-grid" data-count={displayedParticipantCount}>
                {localStream.current && (
                    <Video
                        stream={localStream.current}
                        name={userName}
                        muted
                        mirrored
                    />
                )}
                {participants.map((p) => (
                    <Video
                        key={p.peerId}
                        stream={p.stream ?? null}
                        name={p.name}
                        mirrored
                    />
                ))}
            </div>
            {hasJoined && (
                <button
                    onClick={endCall}
                    className="w-24 flex items-center justify-center cursor-pointer rounded-full bg-red-600 p-3 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    <PhoneOff size={22} className="text-white" />
                </button>
            )}
        </div>
    );
};

export default RoomPage;

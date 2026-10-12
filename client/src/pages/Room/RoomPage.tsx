import { useParams } from "react-router-dom";
import { JoinRoomModal, NotFoundRoom, Video } from "./components";
import { LoaderCircle } from "lucide-react";
import useRoomPage from "./hooks/useRoomPage";
import "./styles.css";

const RoomPage = () => {
    const { code } = useParams<{ code: string }>();

    const {
        participants,
        remoteStreams,
        localStream,
        userName,
        onReady,
        roomNotFound,
        renderJoinModal,
        isLoading,
    } = useRoomPage(code);

    const remoteVideos = participants.flatMap((participant) => {
        const stream = remoteStreams.get(participant.peerId);

        return stream ? [{ participant, stream }] : [];
    });
    const displayedParticipantCount =
        remoteVideos.length + (localStream ? 1 : 0);

    return (
        <div
            className="flex h-screen min-h-0 flex-col overflow-hidden
                bg-[linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab)]
                bg-size-[400%_400%]
                animate-gradient sm:p-3"
        >
            {renderJoinModal && <JoinRoomModal onReady={onReady} />}
            {roomNotFound && <NotFoundRoom />}
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-1 h-screen">
                    <LoaderCircle className="h-16 w-16 animate-spin text-white" />
                    <h2 className="text-white text-xl">Загрузка комнаты...</h2>
                </div>
            )}

            <div className="video-grid" data-count={displayedParticipantCount}>
                {localStream && (
                    <Video stream={localStream} name={userName} muted />
                )}
                {remoteVideos.map(({ participant, stream }) => (
                    <Video
                        key={participant.peerId}
                        stream={stream}
                        name={participant.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomPage;

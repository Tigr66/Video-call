interface VideoProps {
    stream: MediaStream;
    name: string;
    muted?: boolean;
}

const Video = ({ stream, name, muted = false }: VideoProps) => {
    return (
        <div className="relative h-full w-full min-h-0 min-w-0 bg-black overflow-hidden rounded-xl">
            <video
                autoPlay
                playsInline
                muted={muted}
                ref={(video) => {
                    if (video) {
                        video.srcObject = stream;
                    }
                }}
                className="h-full w-full object-contain"
            />

            <span className="absolute bottom-2 left-2 text-white text-lg font-bold">
                {name}
            </span>
        </div>
    );
};

export default Video;

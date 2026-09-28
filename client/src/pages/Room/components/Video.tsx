interface VideoProps {
    stream: MediaStream;
    name: string;
    muted?: boolean;
}

const Video = ({ stream, name, muted = false }: VideoProps) => {
    return (
        <div>
            <video
                autoPlay
                playsInline
                muted={muted}
                ref={(video) => {
                    if (video) {
                        video.srcObject = stream;
                    }
                }}
            />

            <span>{name}</span>
        </div>
    );
};

export default Video;

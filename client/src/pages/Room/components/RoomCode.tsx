import { CopyButton } from "@/components/CopyButton";

interface RoomCodeProps {
    code: string;
}

const RoomCode = ({ code }: RoomCodeProps) => {
    return (
        <div className="flex h-6 w-full items-center justify-center gap-2 bg-blue-950/40 backdrop-blur-sm px-3">
            <span className="font-mono text-sm tracking-wider text-white">
                Код комнаты: {code}
            </span>

            <CopyButton
                copyText={code}
                iconSize={16}
                className="flex items-center justify-center text-white transition-colors hover:text-gray-400"
            />
        </div>
    );
};

export default RoomCode;

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import useJoinModal from "../hooks/useJoinModal";

interface JoinRoomModalProps {
    onReady: (stream: MediaStream, name: string) => void;
}

const JoinRoomModal = ({ onReady }: JoinRoomModalProps) => {
    const {
        name,
        isLoading,
        handleSetName,
        handleJoinRoom,
        isJoinButtonDisabled,
    } = useJoinModal(onReady);

    return (
        <Modal open={true} onClose={() => {}}>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={handleSetName}
                    placeholder="Введите ваше имя"
                    className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <Button
                    onClick={handleJoinRoom}
                    disabled={isJoinButtonDisabled}
                    loading={isLoading}
                >
                    Войти в комнату
                </Button>
            </div>
        </Modal>
    );
};

export default JoinRoomModal;

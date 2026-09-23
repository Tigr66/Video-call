import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { ArrowLeft } from "lucide-react";
import { appRoutes } from "@/routes/app-routes";
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
        navigate,
    } = useJoinModal(onReady);

    return (
        <Modal open={true} onClose={() => {}}>
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(appRoutes.HOME_PAGE)}
                        className="rounded-md p-1 hover:bg-slate-100 hover:text-indigo-500 cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-semibold">
                        Вход в комнату
                    </span>
                </div>

                <input
                    type="text"
                    value={name}
                    aria-label="Ваше имя"
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

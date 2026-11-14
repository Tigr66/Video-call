import { CopyButton } from "@/components/CopyButton";
import { X, Link } from "lucide-react";

interface RoomInviteToastProps {
    open: boolean;
    onClose?: () => void;
}

const RoomInviteToast = ({ open, onClose }: RoomInviteToastProps) => {
    if (!open) return null;

    const url = window.location.href;

    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-50 flex w-[90%] flex-col gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-xl sm:w-80 sm:left-3 sm:translate-x-0">
            <div className="flex justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <Link size={18} />
                    </div>

                    <h2 className="text-sm font-semibold text-gray-900">
                        Пригласить в комнату
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                    <X size={18} />
                </button>
            </div>

            <p className="text-xs leading-relaxed text-gray-500">
                Поделитесь ссылкой, чтобы другие могли присоединиться к звонку
            </p>

            <div className="flex min-w-0 items-center gap-2 rounded-lg bg-gray-100 p-2">
                <span className="min-w-0 overflow-hidden text-nowrap text-ellipsis flex-1 truncate text-xs text-gray-700">
                    {url}
                </span>

                <CopyButton
                    copyText={url}
                    iconSize={16}
                    className="rounded-md p-1 text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
                />
            </div>
        </div>
    );
};

export default RoomInviteToast;

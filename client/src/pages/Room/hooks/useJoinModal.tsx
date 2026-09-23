import { notifyError } from "@/services/notify.service";
import { useState } from "react";

const useJoinModal = (onReady: (stream: MediaStream, name: string) => void) => {
    const [name, setName] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 32) setName(event.target.value);
    };

    const handleJoinRoom = async () => {
        try {
            setIsLoading(true);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            onReady(stream, name);
        } catch (error) {
            notifyError("Необходимо разрешить доступ к камере и микрофону");
        } finally {
            setIsLoading(false);
        }
    };

    const isJoinButtonDisabled = name.length === 0 || isLoading;

    return {
        name,
        isLoading,
        handleSetName,
        handleJoinRoom,
        isJoinButtonDisabled,
    };
};

export default useJoinModal;

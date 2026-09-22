import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

const useHomePage = () => {
    const [code, setCode] = useState<string>("");

    const { isLoading, isSending } = useAppSelector((state) => state.room);

    const handleSetCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    return { code, handleSetCode, isLoading, isSending };
};

export default useHomePage;

import { appRoutes } from "@/routes/app-routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRoomThunk } from "@/store/room-slice/room-thunks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const invalidCharsRegex: RegExp = /[^A-Z0-9]/g;

const useHomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [code, setCode] = useState<string>("");

    const { isLoading, isSending } = useAppSelector((state) => state.room);

    const handleSetCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toUpperCase()
            .replace(invalidCharsRegex, "")
            .slice(0, 6);

        const formattedValue =
            value.length > 3 ? `${value.slice(0, 3)}-${value.slice(3)}` : value;

        setCode(formattedValue);
    };

    const handleCreateRoom = async () => {
        const room = await dispatch(addRoomThunk()).unwrap();

        navigate(appRoutes.ROOM_PAGE.replace(":code", room.code));
    };

    const handleJoinRoom = () => {
        navigate(appRoutes.ROOM_PAGE.replace(":code", code.replace("-", "")));
    };

    const isJoinButtonDisabled =
        code.replace("-", "").length !== 6 || isSending;

    return {
        code,
        handleSetCode,
        handleCreateRoom,
        handleJoinRoom,
        isLoading,
        isSending,
        isJoinButtonDisabled,
    };
};

export default useHomePage;

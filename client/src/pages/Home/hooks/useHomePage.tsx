import { appRoutes } from "@/routes/app-routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRoomThunk } from "@/store/room-slice/room-thunks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useHomePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [code, setCode] = useState<string>("");

    const { isLoading, isSending } = useAppSelector((state) => state.room);

    const handleSetCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 6) setCode(event.target.value);
    };

    const handleCreateRoom = async () => {
        const room = await dispatch(addRoomThunk()).unwrap();

        navigate(appRoutes.ROOM_PAGE.replace(":code", room.code));
    };

    const handleJoinRoom = () => {
        navigate(appRoutes.ROOM_PAGE.replace(":code", code));
    };

    const isJoinButtonDisabled = code.length !== 6 || isSending;

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

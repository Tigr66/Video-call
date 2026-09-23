import { Button } from "@/components/Button";
import { appRoutes } from "@/routes/app-routes";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import notFoundRoom from "@/assets/icons/not-found-room.png";

const NotFoundRoom = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <img
                    src={notFoundRoom}
                    alt="Комната не найдена"
                    className="w-96 h-96"
                />
                <p className="text-white text-xl ml-4">Комната не найдена</p>
                <Button
                    onClick={() => navigate(appRoutes.HOME_PAGE)}
                    className="ml-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться на главную
                </Button>
            </div>
        </div>
    );
};

export default NotFoundRoom;

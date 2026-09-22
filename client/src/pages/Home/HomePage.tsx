import { Divider } from "@/components/Divider";

import useHomePage from "./hooks/useHomePage";
import { Button } from "@/components/Button";

const HomePage = () => {
    const { code, handleSetCode, isLoading, isSending } = useHomePage();

    return (
        <div className="w-full h-screen flex flex-col gap-4">
            <h1 className="text-2xl text-center text-slate-600 font-bold border-b-2 border-slate-600 p-4 sm:text-left sm:text-3xl md:text-4xl">
                Добро пожаловать в{" "}
                <span className="text-indigo-500">CallUp</span>
            </h1>
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="room-code"
                        className="text-sm font-medium text-slate-700"
                    >
                        Код комнаты
                    </label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id="room-code"
                            type="text"
                            value={code}
                            onChange={handleSetCode}
                            placeholder="Введите код комнаты"
                            className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <Button loading={isLoading}>
                            Войти в комнату
                        </Button>
                    </div>

                    <Divider text="или" />

                    <Button loading={isSending}>
                        Создать комнату
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

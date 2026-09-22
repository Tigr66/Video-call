import { store } from "@/store";
import { Provider } from "react-redux";
import type { ReactNode } from "react";

interface AppStoreProviderProps {
    children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
    return <Provider store={store}>{children}</Provider>;
};

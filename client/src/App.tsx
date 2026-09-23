import { BrowserRouter, Route, Routes } from "react-router";

import { HomePage } from "./pages/Home";
import { RoomPage } from "./pages/Room";

import { AppToastContainer } from "./components/AppToastContainer";

import { appRoutes } from "./routes/app-routes";

import "./index.css";

const App = () => {
    return (
        <>
            <AppToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path={appRoutes.HOME_PAGE} element={<HomePage />} />
                    <Route path={appRoutes.ROOM_PAGE} element={<RoomPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;

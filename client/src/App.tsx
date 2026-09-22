import { BrowserRouter, Route, Routes } from "react-router";

import { HomePage } from "./pages/Home";
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
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;

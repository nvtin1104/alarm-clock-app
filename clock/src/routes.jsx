import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Alarm from "./pages/alarm";
import MainLayout from "./layouts/main";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", Component: Home },
            { path: "/alarm", Component: Alarm },
        ]
    }
]);

import { Link, Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/alarm">Alarm</Link>
            <Outlet />
        </div>
    );
}

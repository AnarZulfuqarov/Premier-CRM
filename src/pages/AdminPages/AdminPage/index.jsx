import { useState } from "react";
import AdminNavbar from "../AdminNavbar/index.jsx";
import AdminLeftBar from "../AdminLeftBar/index.jsx";
import "./index.scss";
import { Outlet } from "react-router-dom";

function AdminPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div id="adminPage">
            <AdminNavbar onToggleSidebar={toggleSidebar} />

            <div className="row">
                <div className={`col-2 leftbar-container ${isSidebarOpen ? 'open' : ''}`}>
                    <AdminLeftBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
                </div>

                <div className="col-10 content-container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminPage;

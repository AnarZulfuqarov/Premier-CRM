import "./index.scss";
import {Outlet} from "react-router-dom";
import {useState} from "react";
import AccounterLeftBar from "../AccounterLeftBar/index.jsx";
import AccounterNavbar from "../AccounterNavbar/index.jsx";

function AccounterPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    return (
        <div id="accounterPage">
            <AccounterNavbar setSidebarOpen={setSidebarOpen}/>
            <div className={"row"}>
                {isMobile ? (
                    ""
                ):(<div className={"col-2"}>
                    <AccounterLeftBar/>
                </div>)}
                <div className={"col-10  col-sm-12 col-xs-12"}>
                       <Outlet/>
                </div>
            </div>
            {/* Mobil sidebar */}
            <AccounterLeftBar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
    );
}

export default AccounterPage;
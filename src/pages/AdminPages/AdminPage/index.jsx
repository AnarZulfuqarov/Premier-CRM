import AdminNavbar from "../AdminNavbar/index.jsx";
import AdminLeftBar from "../AdminLeftBar/index.jsx";
import "./index.scss";
import OrderForm from "../../CustomerPage/CustomerOrderAdd/index.jsx";
import {Outlet} from "react-router-dom";

function AdminPage() {
    return (
        <div id="adminPage">
            <AdminNavbar />
            <div className={"row"}>
                <div className={"col-2"}>
                        <AdminLeftBar />
                </div>
                <div className={"col-10"}>
                       <Outlet/>
                </div>
            </div>

        </div>
    );
}

export default AdminPage;
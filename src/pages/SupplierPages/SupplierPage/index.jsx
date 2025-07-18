import "./index.scss";
import {Outlet} from "react-router-dom";
import SupplierNavbar from "../SupplierNavbar/index.jsx";
import SupplierLeftBar from "../SupplierLeftBar/index.jsx";
import {useState} from "react";

function SupplierPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    return (
        <div id="supplierPage">
            <SupplierNavbar setSidebarOpen={setSidebarOpen}/>
            <div className={"row"}>
                {isMobile ? (
                    ""
                ):(<div className={"col-2"}>
                    <SupplierLeftBar/>
                </div>)}
                <div className={"col-10  col-sm-12 col-xs-12"}>
                       <Outlet/>
                </div>
            </div>
            {/* Mobil sidebar */}
            <SupplierLeftBar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
    );
}

export default SupplierPage;
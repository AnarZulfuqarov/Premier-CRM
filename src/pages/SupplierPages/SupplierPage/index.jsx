import "./index.scss";
import {Outlet} from "react-router-dom";
import SupplierNavbar from "../SupplierNavbar/index.jsx";
import SupplierLeftBar from "../SupplierLeftBar/index.jsx";

function SupplierPage() {
    return (
        <div id="supplierPage">
            <SupplierNavbar/>
            <div className={"row"}>
                <div className={"col-2"}>
                        <SupplierLeftBar/>
                </div>
                <div className={"col-10"}>
                       <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default SupplierPage;
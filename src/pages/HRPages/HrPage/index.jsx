import "./index.scss";
import {Outlet} from "react-router-dom";
import HrNavbar from "../HRNavbar/index.jsx";
import HrLeftBar from "../HRLeftBar/index.jsx";

function HrPage() {
    return (
        <div id="hrSistem">
            <HrNavbar/>
            <div className={"row"}>
                <div className={"col-2"}>
                        <HrLeftBar/>
                </div>
                <div className={"col-10"} style={{
                    padding: "16px 16px 16px 0"
                }}>
                       <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default HrPage;
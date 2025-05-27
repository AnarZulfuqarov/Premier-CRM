import React from 'react';
import './index.scss';
import {NavLink, useLocation} from "react-router-dom";

const AdminLeftBar = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <ul className="sidebar__menu">
                <li className={location.pathname === "/admin/customerAdd" ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5Z"
      stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.5 12H16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 7.5V16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                    </span> <NavLink to={'/admin/customerAdd'} className="link">
                    Yeni sifariş
                </NavLink>
                </li>
                <li className={location.pathname === "/admin/history" ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
  <path
      d="M12.0112 0.71875C9.18296 0.720258 6.46854 1.83308 4.45313 3.81733V0.71875H3.01563V6.46875H8.76563V5.03125H5.27461C6.14597 4.12302 7.19185 3.40019 8.34947 2.90615C9.50709 2.41211 10.7526 2.15704 12.0112 2.15625C17.157 2.15625 21.3438 6.34297 21.3438 11.4888C21.3438 16.6346 17.157 20.8213 12.0112 20.8213C6.86543 20.8213 2.67871 16.6346 2.67871 11.4888H1.24121C1.24121 13.6189 1.87286 15.7012 3.05628 17.4723C4.23971 19.2434 5.92176 20.6238 7.88972 21.439C9.85769 22.2541 12.0232 22.4674 14.1124 22.0519C16.2015 21.6363 18.1206 20.6105 19.6268 19.1043C21.133 17.5981 22.1588 15.6791 22.5743 13.5899C22.9899 11.5007 22.7766 9.33523 21.9614 7.36726C21.1463 5.39929 19.7659 3.71725 17.9947 2.53382C16.2236 1.3504 14.1413 0.718747 12.0112 0.71875Z"
      fill="black"/>
  <path d="M11.2812 5.02905L11.2572 12.9375H17.0312V11.5H12.6991L12.7187 5.03346L11.2812 5.02905Z" fill="black"/>
</svg>
                    </span> <NavLink to={"/admin/history"} className="link">
                    Tarixcə
                </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default AdminLeftBar;
import './index.scss';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const AdminLeftBar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const showPopup = usePopup()
    const handleLogout = () => {
        // Bütün cookies sil
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
        localStorage.setItem('auth-change', Date.now());
        if (onClose) onClose();
        showPopup("Sistemdən çıxış edildi","Hesabdan uğurla çıxış etdiniz.","success")
        navigate('/');
    };

    return (
        <aside className={`sidebarCustomer ${isOpen ? 'open' : ''}`}>
            <ul className="sidebarCustomer__menu">
                <li onClick={()=>{
                    onClose();
                    navigate('/customer/customerAdd')
                }} className={location.pathname === "/customer/customerAdd" ? "sidebarCustomer__menu-item active" : "sidebarCustomer__menu-item"}>
                    <span className="sidebarCustomer__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
  <path
      d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5Z"
      stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.5 12H16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 7.5V16.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                    </span> <NavLink to={'/customer/customerAdd'} className="link">
                    Yeni sifariş
                </NavLink>
                </li>
                <li onClick={()=>{
                    onClose();
                    navigate('/customer/history')
                }} className={location.pathname === "/customer/history" ? "sidebarCustomer__menu-item active" : "sidebarCustomer__menu-item"}>
                    <span className="sidebarCustomer__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 23" fill="none">
  <path
      d="M12.0112 0.71875C9.18296 0.720258 6.46854 1.83308 4.45313 3.81733V0.71875H3.01563V6.46875H8.76563V5.03125H5.27461C6.14597 4.12302 7.19185 3.40019 8.34947 2.90615C9.50709 2.41211 10.7526 2.15704 12.0112 2.15625C17.157 2.15625 21.3438 6.34297 21.3438 11.4888C21.3438 16.6346 17.157 20.8213 12.0112 20.8213C6.86543 20.8213 2.67871 16.6346 2.67871 11.4888H1.24121C1.24121 13.6189 1.87286 15.7012 3.05628 17.4723C4.23971 19.2434 5.92176 20.6238 7.88972 21.439C9.85769 22.2541 12.0232 22.4674 14.1124 22.0519C16.2015 21.6363 18.1206 20.6105 19.6268 19.1043C21.133 17.5981 22.1588 15.6791 22.5743 13.5899C22.9899 11.5007 22.7766 9.33523 21.9614 7.36726C21.1463 5.39929 19.7659 3.71725 17.9947 2.53382C16.2236 1.3504 14.1413 0.718747 12.0112 0.71875Z"
      fill="black"/>
  <path d="M11.2812 5.02905L11.2572 12.9375H17.0312V11.5H12.6991L12.7187 5.03346L11.2812 5.02905Z" fill="black"/>
</svg>
                    </span> <NavLink to={"/customer/history"} className="link">
                    Tarixcə
                </NavLink>
                </li>
            </ul>
            <div>
                <button className={"logOut"} onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11C11.55 21 12 20.55 12 20C12 19.45 11.55 19 11 19H5V5Z" fill="#ED0303"/>
                        <path d="M20.65 11.65L17.86 8.86004C17.7905 8.78859 17.7012 8.73952 17.6036 8.71911C17.506 8.69869 17.4045 8.70787 17.3121 8.74545C17.2198 8.78304 17.1408 8.84733 17.0851 8.93009C17.0295 9.01286 16.9999 9.11033 17 9.21004V11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13H17V14.79C17 15.24 17.54 15.46 17.85 15.14L20.64 12.35C20.84 12.16 20.84 11.84 20.65 11.65Z" fill="#ED0303"/>
                    </svg>Çıxış et</button>
            </div>
        </aside>
    );
};

export default AdminLeftBar;
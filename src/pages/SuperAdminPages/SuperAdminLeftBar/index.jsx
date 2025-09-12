import './index.scss';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {MdLogout} from "react-icons/md";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";

const SuperAdminLeftBar = () => {
    const location = useLocation();
    const [productsOpen, setProductsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [accounterOpen, setAccounterOpen] = useState(false);
    // Eğer rota /superAdmin/products/... ise dropdown otomatik açık olsun
    useEffect(() => {
        if (location.pathname.startsWith("/superAdmin/products")) {
            setProductsOpen(true);
        }
    }, [location.pathname]);
    const showPopup = usePopup()
    const toggleProducts = () => setProductsOpen(o => !o);
    const toggleAccounter = () => setAccounterOpen(o => !o);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Bütün cookies sil
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
        localStorage.setItem('auth-change', Date.now());
        showPopup("Sistemdən çıxış edildi", "Hesabdan uğurla çıxış etdiniz.", "success")
        // Ana səhifəyə yönləndir
        navigate('/');
    };
    return (
        <aside className="sidebar">
            <ul className="sidebar__menu">
                <li className={location.pathname === "/superAdmin/statistik" ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M19 7.5C20.3807 7.5 21.5 6.38071 21.5 5C21.5 3.61929 20.3807 2.5 19 2.5C17.6193 2.5 16.5 3.61929 16.5 5C16.5 6.38071 17.6193 7.5 19 7.5Z"
      stroke="black" stroke-width="1.5"/>
  <path
      d="M21.25 10V15.25C21.25 16.8413 20.6179 18.3674 19.4926 19.4926C18.3674 20.6179 16.8413 21.25 15.25 21.25H8.75C7.1587 21.25 5.63258 20.6179 4.50736 19.4926C3.38214 18.3674 2.75 16.8413 2.75 15.25V8.75C2.75 7.1587 3.38214 5.63258 4.50736 4.50736C5.63258 3.38214 7.1587 2.75 8.75 2.75H14"
      stroke="black" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M8.276 16.0356V11.6476M12.106 16.0356V8.76855M15.724 16.0356V10.5256" stroke="black" stroke-width="1.6"
        stroke-linecap="round"/>
</svg>
                    </span> <NavLink to={'/superAdmin/statistik'} className="link">
                    Statistikalar
                </NavLink>
                </li>
                <li className={location.pathname.startsWith("/superAdmin/people") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
      stroke="black" stroke-width="1.5"/>
  <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="black" stroke-width="1.5"/>
  <path d="M17.97 20C17.81 17.108 16.925 15 12 15C7.07503 15 6.19003 17.108 6.03003 20" stroke="black"
        stroke-width="1.5" stroke-linecap="round"/>
</svg>
                    </span> <NavLink to={'/superAdmin/people'} className="link">
                    Sifarişçilər
                </NavLink>
                </li>
                <li className={location.pathname.startsWith("/superAdmin/supplier") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M21.228 18C22.206 18 23 18.794 23 19.773V19.875C23 21.431 21.714 23 18.5 23C15.286 23 14 21.437 14 19.875V19.773C14 18.793 14.793 18 15.773 18H21.228ZM16.25 2C16.4489 2 16.6397 2.07902 16.7803 2.21967C16.921 2.36032 17 2.55109 17 2.75V4H17.75C18.0455 4 18.3381 4.0582 18.611 4.17127C18.884 4.28434 19.1321 4.45008 19.341 4.65901C19.5499 4.86794 19.7157 5.11598 19.8287 5.38896C19.9418 5.66194 20 5.95453 20 6.25V11.336C19.5311 11.1142 19.0187 10.9995 18.5 11V6.25C18.5 6.05109 18.421 5.86032 18.2803 5.71967C18.1397 5.57902 17.9489 5.5 17.75 5.5H6.25C6.05109 5.5 5.86032 5.57902 5.71967 5.71967C5.57902 5.86032 5.5 6.05109 5.5 6.25V19.75C5.5 20.164 5.836 20.5 6.25 20.5H13.053C13.1424 21.0394 13.3515 21.552 13.665 22H6.25C5.65326 22 5.08097 21.7629 4.65901 21.341C4.23705 20.919 4 20.3467 4 19.75V6.25C4 5.65326 4.23705 5.08097 4.65901 4.65901C5.08097 4.23705 5.65326 4 6.25 4H7V2.75C7 2.55109 7.07902 2.36032 7.21967 2.21967C7.36032 2.07902 7.55109 2 7.75 2C7.94891 2 8.13968 2.07902 8.28033 2.21967C8.42098 2.36032 8.5 2.55109 8.5 2.75V4H11.25V2.75C11.25 2.55109 11.329 2.36032 11.4697 2.21967C11.6103 2.07902 11.8011 2 12 2C12.1989 2 12.3897 2.07902 12.5303 2.21967C12.671 2.36032 12.75 2.55109 12.75 2.75V4H15.5V2.75C15.5 2.55109 15.579 2.36032 15.7197 2.21967C15.8603 2.07902 16.0511 2 16.25 2ZM11.327 16.004C11.5115 16.0231 11.6824 16.11 11.8067 16.2478C11.9309 16.3855 11.9996 16.5645 11.9996 16.75C11.9996 16.9355 11.9309 17.1145 11.8067 17.2522C11.6824 17.39 11.5115 17.4769 11.327 17.496L11.25 17.5H8.25C8.05109 17.5 7.86032 17.421 7.71967 17.2803C7.57902 17.1397 7.5 16.9489 7.5 16.75C7.5 16.5511 7.57902 16.3603 7.71967 16.2197C7.86032 16.079 8.05109 16 8.25 16H11.25L11.327 16.004ZM18.5 12C19.163 12 19.7989 12.2634 20.2678 12.7322C20.7366 13.2011 21 13.837 21 14.5C21 15.163 20.7366 15.7989 20.2678 16.2678C19.7989 16.7366 19.163 17 18.5 17C17.837 17 17.2011 16.7366 16.7322 16.2678C16.2634 15.7989 16 15.163 16 14.5C16 13.837 16.2634 13.2011 16.7322 12.7322C17.2011 12.2634 17.837 12 18.5 12ZM14.25 12C14.4489 12 14.6397 12.079 14.7803 12.2197C14.921 12.3603 15 12.5511 15 12.75C15 12.9489 14.921 13.1397 14.7803 13.2803C14.6397 13.421 14.4489 13.5 14.25 13.5H8.25C8.05109 13.5 7.86032 13.421 7.71967 13.2803C7.57902 13.1397 7.5 12.9489 7.5 12.75C7.5 12.5511 7.57902 12.3603 7.71967 12.2197C7.86032 12.079 8.05109 12 8.25 12H14.25ZM15.75 8C15.9489 8 16.1397 8.07902 16.2803 8.21967C16.421 8.36032 16.5 8.55109 16.5 8.75C16.5 8.94891 16.421 9.13968 16.2803 9.28033C16.1397 9.42098 15.9489 9.5 15.75 9.5H8.25C8.05109 9.5 7.86032 9.42098 7.71967 9.28033C7.57902 9.13968 7.5 8.94891 7.5 8.75C7.5 8.55109 7.57902 8.36032 7.71967 8.21967C7.86032 8.07902 8.05109 8 8.25 8H15.75Z"
      fill="#171717"/>
</svg>
                    </span> <NavLink to={'/superAdmin/supplier'} className="link">
                    Təchizatçılar
                </NavLink>
                </li>

                <li>
                    <div className={`sidebar__menu-item sidebar__dropdown
            ${productsOpen ? "open" : ""}
            ${location.pathname.startsWith("/superAdmin/products") ? "active" : ""}
          `}
                         onClick={toggleProducts}
                         ref={dropdownRef}>
              <span className="sidebar__menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_397_489)">
    <path
        d="M14.4375 0.0214844L22 3.80273V12.2354L20.625 11.5479V5.33887L15.125 8.08887V10.8604L13.75 11.5479V8.08887L8.25 5.33887V7.77734L6.875 7.08984V3.80273L14.4375 0.0214844ZM14.4375 6.89648L16.3389 5.94043L11.3652 3.09375L9.09863 4.23242L14.4375 6.89648ZM17.8213 5.20996L19.7764 4.23242L14.4375 1.55762L12.8369 2.36328L17.8213 5.20996ZM12.375 12.2354L11 12.9229V12.9121L6.875 14.9746V19.8623L11 17.7891V19.3359L6.1875 21.7422L0 18.6377V11.376L6.1875 8.28223L12.375 11.376V12.2354ZM5.5 19.8623V14.9746L1.375 12.9121V17.7891L5.5 19.8623ZM6.1875 13.7822L10.1514 11.8057L6.1875 9.81836L2.22363 11.8057L6.1875 13.7822ZM12.375 13.7715L17.1875 11.3652L22 13.7715V19.4326L17.1875 21.8389L12.375 19.4326V13.7715ZM16.5 19.959V16.6826L13.75 15.3076V18.584L16.5 19.959ZM20.625 18.584V15.3076L17.875 16.6826V19.959L20.625 18.584ZM17.1875 15.4902L19.7764 14.1904L17.1875 12.9014L14.5986 14.1904L17.1875 15.4902Z"
        fill="#252525"/>
  </g>
  <defs>
    <clipPath id="clip0_397_489">
      <rect width="22" height="22" fill="white"/>
    </clipPath>
  </defs>
</svg>
                </span>
                        <span className="sidebar__dropdown-title">
            Məhsullar
          </span>
                        <span className="sidebar__dropdown-arrow">
            {productsOpen
                ? <svg width="12" height="12" /* aşağı ok */>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 0.999999L6 6L11 1" stroke="#7C7C7C" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </svg>
                : <svg width="12" height="12" /* sağ ok */>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 0.999999L6 6L11 1" stroke="#7C7C7C" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </svg>
            }
          </span>
                    </div>
                    {productsOpen && (
                        <ul className="sidebar__submenu">
                            <li>
                                <NavLink
                                    to="/superAdmin/products/products"
                                    className={({isActive}) =>
                                        isActive ? "sidebar__submenu-item active" : "sidebar__submenu-item"
                                    }
                                >
                                    Məhsullar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/superAdmin/products/categories"
                                    className={({isActive}) =>
                                        isActive ? "sidebar__submenu-item active" : "sidebar__submenu-item"
                                    }
                                >
                                    Kateqoriyalar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/superAdmin/products/vendors"
                                    className={({isActive}) =>
                                        isActive ? "sidebar__submenu-item active" : "sidebar__submenu-item"
                                    }
                                >
                                    Vendorlar
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>
                <li className={location.pathname.startsWith("/superAdmin/companies") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M10.5 6H9.5C9.22386 6 9 6.22386 9 6.5V7.5C9 7.77614 9.22386 8 9.5 8H10.5C10.7761 8 11 7.77614 11 7.5V6.5C11 6.22386 10.7761 6 10.5 6Z"
      fill="black"/>
  <path
      d="M14.5 6H13.5C13.2239 6 13 6.22386 13 6.5V7.5C13 7.77614 13.2239 8 13.5 8H14.5C14.7761 8 15 7.77614 15 7.5V6.5C15 6.22386 14.7761 6 14.5 6Z"
      fill="black"/>
  <path
      d="M10.5 9.5H9.5C9.22386 9.5 9 9.72386 9 10V11C9 11.2761 9.22386 11.5 9.5 11.5H10.5C10.7761 11.5 11 11.2761 11 11V10C11 9.72386 10.7761 9.5 10.5 9.5Z"
      fill="black"/>
  <path
      d="M14.5 9.5H13.5C13.2239 9.5 13 9.72386 13 10V11C13 11.2761 13.2239 11.5 13.5 11.5H14.5C14.7761 11.5 15 11.2761 15 11V10C15 9.72386 14.7761 9.5 14.5 9.5Z"
      fill="black"/>
  <path
      d="M10.5 13H9.5C9.22386 13 9 13.2239 9 13.5V14.5C9 14.7761 9.22386 15 9.5 15H10.5C10.7761 15 11 14.7761 11 14.5V13.5C11 13.2239 10.7761 13 10.5 13Z"
      fill="black"/>
  <path
      d="M14.5 13H13.5C13.2239 13 13 13.2239 13 13.5V14.5C13 14.7761 13.2239 15 13.5 15H14.5C14.7761 15 15 14.7761 15 14.5V13.5C15 13.2239 14.7761 13 14.5 13Z"
      fill="black"/>
  <path
      d="M18.25 19.25H17.75V4C17.7474 3.80189 17.6676 3.61263 17.5275 3.47253C17.3874 3.33244 17.1981 3.25259 17 3.25H7C6.80189 3.25259 6.61263 3.33244 6.47253 3.47253C6.33244 3.61263 6.25259 3.80189 6.25 4V19.25H5.75C5.55109 19.25 5.36032 19.329 5.21967 19.4697C5.07902 19.6103 5 19.8011 5 20C5 20.1989 5.07902 20.3897 5.21967 20.5303C5.36032 20.671 5.55109 20.75 5.75 20.75H18.25C18.4489 20.75 18.6397 20.671 18.7803 20.5303C18.921 20.3897 19 20.1989 19 20C19 19.8011 18.921 19.6103 18.7803 19.4697C18.6397 19.329 18.4489 19.25 18.25 19.25ZM16.25 19.25H11V17C11 16.8674 10.9473 16.7402 10.8536 16.6464C10.7598 16.5527 10.6326 16.5 10.5 16.5H9.5C9.36739 16.5 9.24021 16.5527 9.14645 16.6464C9.05268 16.7402 9 16.8674 9 17V19.25H7.75V4.75H16.25V19.25Z"
      fill="black"/>
</svg>
                    </span> <NavLink to={"/superAdmin/companies"} className="link">
                    Şirkətlər
                </NavLink>
                </li>
                <li className={location.pathname.startsWith("/superAdmin/vezife") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_240_10035)">
    <path
        d="M0.75 14.25V23.25M9 18.75H12.75C13.5456 18.75 14.3087 19.0661 14.8713 19.6287C15.4339 20.1913 15.75 20.9544 15.75 21.75H0.75V15.75H6C6.79565 15.75 7.55871 16.0661 8.12132 16.6287C8.68393 17.1913 9 17.9544 9 18.75ZM9 18.75H6M7.25 12.75V5.75C7.25 5.21957 7.46071 4.71086 7.83579 4.33579C8.21086 3.96072 8.71957 3.75 9.25 3.75H21.25C21.7804 3.75 22.2891 3.96072 22.6642 4.33579C23.0393 4.71086 23.25 5.21957 23.25 5.75V12.75C23.25 13.2804 23.0393 13.7891 22.6642 14.1642C22.2891 14.5393 21.7804 14.75 21.25 14.75H11M7.25 7.75H23.25M15.25 7.75V9.75M18.25 3.75H12.25L12.611 1.586C12.6499 1.35199 12.7707 1.13943 12.9519 0.986292C13.1331 0.83315 13.3628 0.749401 13.6 0.750003H16.9C17.1367 0.750112 17.3657 0.834184 17.5462 0.987263C17.7268 1.14034 17.8472 1.3525 17.886 1.586L18.25 3.75Z"
        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_240_10035">
      <rect width="22" height="22" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    </span> <NavLink to={"/superAdmin/vezife"} className="link">
                    Vəzifə
                </NavLink>
                </li>
                <li className={location.pathname.startsWith("/superAdmin/history") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M12.0112 0.71875C9.18296 0.720258 6.46854 1.83308 4.45313 3.81733V0.71875H3.01563V6.46875H8.76563V5.03125H5.27461C6.14597 4.12302 7.19185 3.40019 8.34947 2.90615C9.50709 2.41211 10.7526 2.15704 12.0112 2.15625C17.157 2.15625 21.3438 6.34297 21.3438 11.4888C21.3438 16.6346 17.157 20.8213 12.0112 20.8213C6.86543 20.8213 2.67871 16.6346 2.67871 11.4888H1.24121C1.24121 13.6189 1.87286 15.7012 3.05628 17.4723C4.23971 19.2434 5.92176 20.6238 7.88972 21.439C9.85769 22.2541 12.0232 22.4674 14.1124 22.0519C16.2015 21.6363 18.1206 20.6105 19.6268 19.1043C21.133 17.5981 22.1588 15.6791 22.5743 13.5899C22.9899 11.5007 22.7766 9.33523 21.9614 7.36726C21.1463 5.39929 19.7659 3.71725 17.9947 2.53382C16.2236 1.3504 14.1413 0.718747 12.0112 0.71875Z"
      fill="black"/>
  <path d="M11.2812 5.02905L11.2572 12.9375H17.0312V11.5H12.6991L12.7187 5.03346L11.2812 5.02905Z" fill="black"/>
</svg>
                    </span> <NavLink to={"/superAdmin/history"} className="link">
                    Tarixcə
                </NavLink>
                </li>
                <li className={location.pathname.startsWith("/superAdmin/kalkulyasiya") ? "sidebar__menu-item active" : "sidebar__menu-item"}>
                    <span className="sidebar__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M18 8H14M16 6V10M18 17.5H14M18 14.5H14M10 17.5L8.25 15.75M8.25 15.75L6.5 14M8.25 15.75L10 14M8.25 15.75L6.5 17.5M10 8H6M21.5 12.95V11.05C21.5 7.02 21.5 5.004 20.109 3.752C18.718 2.5 16.479 2.5 12 2.5C7.522 2.5 5.282 2.5 3.891 3.752C2.5 5.004 2.5 7.02 2.5 11.05V12.95C2.5 16.98 2.5 18.996 3.891 20.248C5.282 21.5 7.521 21.5 12 21.5C16.478 21.5 18.718 21.5 20.109 20.248C21.5 18.996 21.5 16.98 21.5 12.95Z"
      stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                    </span> <NavLink to={"/superAdmin/kalkulyasiya"} className="link">
                    Kalkulyasiya
                </NavLink>
                </li>

                <li>
                    <div className={`sidebar__menu-item sidebar__dropdown
            ${accounterOpen ? "open" : ""}
            ${location.pathname.startsWith("/superAdmin/accounter") ? "active" : ""}
          `}
                         onClick={toggleAccounter}
                         ref={dropdownRef}>
              <span className="sidebar__menu-icon">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M16.36 12.76C18.31 13.42 20 14.5 20 16V21H4V16C4 14.5 5.69 13.42 7.65 12.76L8.27 14L8.5 14.5C7 14.96 5.9 15.62 5.9 16V19.1H10.12L11 14.03L10.06 12.15C10.68 12.08 11.33 12.03 12 12.03C12.67 12.03 13.32 12.08 13.94 12.15L13 14.03L13.88 19.1H18.1V16C18.1 15.62 17 14.96 15.5 14.5L15.73 14L16.36 12.76ZM12 5C10.9 5 10 5.9 10 7C10 8.1 10.9 9 12 9C13.1 9 14 8.1 14 7C14 5.9 13.1 5 12 5ZM12 11C9.79 11 8 9.21 8 7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7C16 9.21 14.21 11 12 11Z"
      fill="#171717"/>
</svg>
                </span>
                        <span className="sidebar__dropdown-title">
            Mühasibatlıq
          </span>
                        <span className="sidebar__dropdown-arrow">
            {accounterOpen
                ? <svg width="12" height="12" /* aşağı ok */>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 0.999999L6 6L11 1" stroke="#7C7C7C" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </svg>
                : <svg width="12" height="12" /* sağ ok */>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 0.999999L6 6L11 1" stroke="#7C7C7C" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </svg>
            }
          </span>
                    </div>
                    {accounterOpen && (
                        <ul className="sidebar__submenu">
                            <li>
                                <NavLink
                                    to="/superAdmin/accounter/accounter"
                                    className={({isActive}) =>
                                        isActive ? "sidebar__submenu-item active" : "sidebar__submenu-item"
                                    }
                                >
                                    Mühasiblər
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/superAdmin/accounter/borc"
                                    className={({isActive}) =>
                                        isActive ? "sidebar__submenu-item active" : "sidebar__submenu-item"
                                    }
                                >
                                    Borc
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
            <div>
                <button className={"logOut"} onClick={handleLogout}>
                    <MdLogout style={{
                        fontSize: "18px",
                    }}/>
                    <div>Çıxış et</div>
                </button>
            </div>
        </aside>
    )
        ;
};

export default SuperAdminLeftBar;
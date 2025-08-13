import './index.scss';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {usePopup} from "../../../components/Popup/PopupContext.jsx";
import Cookies from "js-cookie";
import {useGetOrderCompanyInCompleteQuery} from "../../../services/adminApi.jsx";

const SupplierLeftBar = ({ isOpen = false, onClose = () => {} }) => {
    const location = useLocation();
    const [productsOpen, setProductsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const showPopup = usePopup()
    const companyId = Cookies.get('companyId');

    const { data: orderData, isFetching, isError, error } = useGetOrderCompanyInCompleteQuery(companyId);
    const orders = orderData?.data
    console.log(orders)
    // Eğer rota /supplier/products/... ise dropdown otomatik açık olsun
    useEffect(() => {
        if (location.pathname.startsWith("/supplier/products")) {
            setProductsOpen(true);
        }
    }, [location.pathname]);

    const toggleProducts = () => setProductsOpen(o => !o);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Bütün cookies sil
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
        localStorage.setItem('auth-change', Date.now());
        showPopup("Sistemdən çıxış edildi","Hesabdan uğurla çıxış etdiniz.","success")
        // Ana səhifəyə yönləndir
        navigate('/');
    };
    return (
        <>
            <div className={`mobile-overlay ${isOpen ? "visible" : ""}`} onClick={onClose}></div>
            <aside className={`sidebarSupplier ${isOpen ? "open" : ""}`}>
                <ul className="sidebarSupplier__menu">
                    <li onClick={onClose} className={location.pathname === "/supplier/activeOrder" ? "sidebarSupplier__menu-item active" : "sidebarSupplier__menu-item"}>
                    <span className="sidebarSupplier__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path
      d="M3.90404 11.9998C3.90404 13.0111 4.07571 13.9744 4.41904 14.8898C4.76304 15.8038 5.27538 16.6358 5.95604 17.3858C6.05071 17.4884 6.10238 17.6001 6.11104 17.7208C6.11971 17.8414 6.07438 17.9511 5.97504 18.0498C5.87571 18.1484 5.76204 18.1864 5.63404 18.1638C5.50604 18.1411 5.39204 18.0761 5.29204 17.9688C4.52938 17.1114 3.96004 16.1914 3.58404 15.2088C3.20738 14.2254 3.01904 13.1558 3.01904 11.9998C3.01904 10.8438 3.20738 9.77409 3.58404 8.79076C3.96071 7.80743 4.53004 6.88743 5.29204 6.03076C5.39138 5.92409 5.50538 5.86009 5.63404 5.83876C5.76271 5.81743 5.87638 5.85643 5.97504 5.95576C6.07371 6.05509 6.11904 6.16376 6.11104 6.28176C6.10304 6.39976 6.05138 6.51009 5.95604 6.61276C5.27538 7.36276 4.76304 8.19509 4.41904 9.10976C4.07571 10.0251 3.90404 10.9884 3.90404 11.9998ZM6.67304 11.9998C6.67304 12.6844 6.78504 13.3091 7.00904 13.8738C7.23238 14.4384 7.53838 14.9604 7.92704 15.4398C8.00904 15.5464 8.05338 15.6581 8.06004 15.7748C8.06671 15.8914 8.02038 15.9991 7.92104 16.0978C7.82171 16.1964 7.71071 16.2384 7.58804 16.2238C7.46538 16.2091 7.36304 16.1504 7.28104 16.0478C6.79771 15.4611 6.42804 14.8384 6.17204 14.1798C5.91604 13.5211 5.78804 12.7944 5.78804 11.9998C5.78804 11.2051 5.91604 10.4784 6.17204 9.81976C6.42804 9.16109 6.79771 8.53843 7.28104 7.95176C7.36304 7.84909 7.46538 7.79043 7.58804 7.77576C7.71138 7.76109 7.82238 7.80309 7.92104 7.90176C8.01971 8.00043 8.06571 8.10809 8.05904 8.22476C8.05238 8.34143 8.00838 8.45309 7.92704 8.55976C7.53838 9.03909 7.23238 9.56109 7.00904 10.1258C6.78571 10.6904 6.67371 11.3151 6.67304 11.9998ZM11.269 16.1918C11.205 15.6931 11.0534 15.2531 10.814 14.8718C10.5754 14.4904 10.3234 14.1214 10.058 13.7648C9.79204 13.4074 9.55571 13.0401 9.34904 12.6628C9.14238 12.2854 9.03904 11.8594 9.03904 11.3848C9.03904 10.5714 9.32904 9.87476 9.90904 9.29476C10.4904 8.71343 11.1874 8.42276 12 8.42276C12.8127 8.42276 13.5094 8.71309 14.09 9.29376C14.6714 9.87509 14.962 10.5718 14.962 11.3838C14.962 11.8584 14.8584 12.2814 14.651 12.6528C14.4444 13.0241 14.208 13.3914 13.942 13.7548C13.676 14.1181 13.424 14.4904 13.186 14.8718C12.948 15.2531 12.7964 15.6931 12.731 16.1918H11.269ZM11.308 17.9998V17.5768H12.692V17.9998C12.692 18.1931 12.6254 18.3568 12.492 18.4908C12.358 18.6248 12.194 18.6918 12 18.6918C11.806 18.6918 11.6424 18.6251 11.509 18.4918C11.3757 18.3584 11.3087 18.1944 11.308 17.9998ZM17.365 11.9998C17.365 11.3151 17.2534 10.6904 17.03 10.1258C16.806 9.56109 16.4997 9.03909 16.111 8.55976C16.029 8.45309 15.985 8.34143 15.979 8.22476C15.973 8.10809 16.019 8.00043 16.117 7.90176C16.215 7.80309 16.326 7.76109 16.45 7.77576C16.574 7.79043 16.6767 7.84909 16.758 7.95176C17.2414 8.53843 17.6107 9.16109 17.866 9.81976C18.1214 10.4784 18.2494 11.2051 18.25 11.9998C18.2507 12.7944 18.1227 13.5211 17.866 14.1798C17.6107 14.8378 17.2414 15.4604 16.758 16.0478C16.676 16.1504 16.5734 16.2091 16.45 16.2238C16.3274 16.2384 16.2164 16.1964 16.117 16.0978C16.0184 15.9991 15.9724 15.8914 15.979 15.7748C15.9857 15.6581 16.03 15.5464 16.112 15.4398C16.5 14.9604 16.806 14.4384 17.03 13.8738C17.254 13.3091 17.365 12.6844 17.365 11.9998ZM20.135 11.9998C20.135 10.9884 19.963 10.0251 19.619 9.10976C19.2757 8.19509 18.7637 7.36276 18.083 6.61276C17.9884 6.51009 17.9367 6.39876 17.928 6.27876C17.9194 6.15876 17.9647 6.04909 18.064 5.94976C18.1634 5.85043 18.2767 5.81243 18.404 5.83576C18.5334 5.85909 18.6474 5.92409 18.746 6.03076C19.496 6.88809 20.0627 7.80809 20.446 8.79076C20.828 9.77343 21.019 10.8431 21.019 11.9998C21.019 13.1564 20.8277 14.2261 20.445 15.2088C20.0624 16.1914 19.496 17.1114 18.746 17.9688C18.6474 18.0754 18.5337 18.1391 18.405 18.1598C18.2764 18.1804 18.1627 18.1418 18.064 18.0438C17.9654 17.9458 17.92 17.8371 17.928 17.7178C17.936 17.5984 17.9877 17.4878 18.083 17.3858C18.763 16.6358 19.275 15.8034 19.619 14.8888C19.963 13.9741 20.135 13.0111 20.135 11.9998Z"
      fill="black"/>
</svg>
                    </span> <NavLink to={'/supplier/activeOrder'} className="link">
                        Aktiv sifarişlər
                    </NavLink>
                    </li>
                    <li onClick={onClose} className={location.pathname === "/supplier/inComplete" ? "sidebarSupplier__menu-item active" : "sidebarSupplier__menu-item"}>
                    <span className="sidebarSupplier__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z" fill="black"/>
  <path d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z" fill="black"/>
  <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="black"/>
  <path d="M12 22.5C9.9233 22.5 7.89323 21.8842 6.16652 20.7304C4.4398 19.5767 3.09399 17.9368 2.29927 16.0182C1.50455 14.0996 1.29661 11.9884 1.70176 9.95156C2.1069 7.91476 3.10693 6.04383 4.57538 4.57538C6.04383 3.10693 7.91476 2.1069 9.95156 1.70176C11.9884 1.29661 14.0996 1.50455 16.0182 2.29927C17.9368 3.09399 19.5767 4.4398 20.7304 6.16652C21.8842 7.89323 22.5 9.9233 22.5 12C22.4968 14.7838 21.3896 17.4527 19.4211 19.4211C17.4527 21.3896 14.7838 22.4968 12 22.5ZM12 3C10.22 3 8.47992 3.52785 6.99987 4.51678C5.51983 5.50571 4.36628 6.91132 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C20.9972 9.61391 20.0481 7.32634 18.3609 5.63911C16.6737 3.95189 14.3861 3.00278 12 3Z" fill="black"/>
</svg>
                    </span> <NavLink to={'/supplier/inComplete'} className="link">
                        Natamam sifarişlər <div className={"countO"}>
                        {orders?.length}
                    </div>
                    </NavLink>
                    </li>
                    <li

                    >
                        <div  className={`sidebarSupplier__menu-item sidebarSupplier__dropdown
            ${productsOpen ? "open" : ""}
            ${location.pathname.startsWith("/supplier/products") ? "active" : ""}
          `}
                              onClick={toggleProducts}
                              ref={dropdownRef}>
              <span className="sidebarSupplier__menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
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
                            <span className="sidebarSupplier__dropdown-title">
            Məhsullar
          </span>
                            <span className="sidebarSupplier__dropdown-arrow">
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
                            <ul className="sidebarSupplier__submenu">
                                <li onClick={onClose}>
                                    <NavLink
                                        to="/supplier/products/products"
                                        className={({isActive}) =>
                                            isActive ? "sidebarSupplier__submenu-item active" : "sidebarSupplier__submenu-item"
                                        }
                                    >
                                        Məhsullar
                                    </NavLink>
                                </li>
                                <li onClick={onClose}>
                                    <NavLink
                                        to="/supplier/products/categories"
                                        className={({isActive}) =>
                                            isActive ? "sidebarSupplier__submenu-item active" : "sidebarSupplier__submenu-item"
                                        }
                                    >
                                        Kateqoriyalar
                                    </NavLink>
                                </li>
                                <li onClick={onClose}>
                                    <NavLink
                                        to="/supplier/products/vendors"
                                        className={({isActive}) =>
                                            isActive ? "sidebarSupplier__submenu-item active" : "sidebarSupplier__submenu-item"
                                        }
                                    >
                                        Vendorlar
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li onClick={onClose} className={location.pathname === "/supplier/history" ? "sidebarSupplier__menu-item active" : "sidebarSupplier__menu-item"}>
                    <span className="sidebarSupplier__menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
  <path
      d="M12.0112 0.71875C9.18296 0.720258 6.46854 1.83308 4.45313 3.81733V0.71875H3.01563V6.46875H8.76563V5.03125H5.27461C6.14597 4.12302 7.19185 3.40019 8.34947 2.90615C9.50709 2.41211 10.7526 2.15704 12.0112 2.15625C17.157 2.15625 21.3438 6.34297 21.3438 11.4888C21.3438 16.6346 17.157 20.8213 12.0112 20.8213C6.86543 20.8213 2.67871 16.6346 2.67871 11.4888H1.24121C1.24121 13.6189 1.87286 15.7012 3.05628 17.4723C4.23971 19.2434 5.92176 20.6238 7.88972 21.439C9.85769 22.2541 12.0232 22.4674 14.1124 22.0519C16.2015 21.6363 18.1206 20.6105 19.6268 19.1043C21.133 17.5981 22.1588 15.6791 22.5743 13.5899C22.9899 11.5007 22.7766 9.33523 21.9614 7.36726C21.1463 5.39929 19.7659 3.71725 17.9947 2.53382C16.2236 1.3504 14.1413 0.718747 12.0112 0.71875Z"
      fill="black"/>
  <path d="M11.2812 5.02905L11.2572 12.9375H17.0312V11.5H12.6991L12.7187 5.03346L11.2812 5.02905Z" fill="black"/>
</svg>
                    </span> <NavLink to={"/supplier/history"} className="link">
                        Tarixcə
                    </NavLink>
                    </li>
                </ul>
                <div>
                    <button className={"logOut"} onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11C11.55 21 12 20.55 12 20C12 19.45 11.55 19 11 19H5V5Z"
                                fill="#ED0303"/>
                            <path
                                d="M20.65 11.65L17.86 8.86004C17.7905 8.78859 17.7012 8.73952 17.6036 8.71911C17.506 8.69869 17.4045 8.70787 17.3121 8.74545C17.2198 8.78304 17.1408 8.84733 17.0851 8.93009C17.0295 9.01286 16.9999 9.11033 17 9.21004V11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13H17V14.79C17 15.24 17.54 15.46 17.85 15.14L20.64 12.35C20.84 12.16 20.84 11.84 20.65 11.65Z"
                                fill="#ED0303"/>
                        </svg>
                        Çıxış et
                    </button>
                </div>
            </aside>
        </>

    )
        ;
};

export default SupplierLeftBar;
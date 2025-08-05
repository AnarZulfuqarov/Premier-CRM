import React, {useEffect, useState} from 'react';
import './index.scss';
import profileIcon from '/src/assets/GenericAvatar.png';
import {
    useChangePasswordCustomersMutation, useGetAdminNotificationsCustomerIdQuery, useGetAdminNotificationsCustomerQuery,
    useGetUserQuery
} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";
import logo from "/src/assets/Mask group.png"
const SupplierNavbar = ({ onToggleSidebar }) => {
    // 3 adet modal için state’ler
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const {data:getUser} = useGetUserQuery()
    const user = getUser?.data
    // input’lar için state
    const {data:getAdminNotificationsSuperAdmin,refetch} = useGetAdminNotificationsCustomerIdQuery(user?.id)
    const notification = getAdminNotificationsSuperAdmin?.data
    const hasUnread = notification?.some(item => item.isRead === false);
    console.log(notification)
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPass2, setNewPass2] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [changePassword] = useChangePasswordCustomersMutation()
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (newPass !== newPass2) {
            alert("Yeni şifrələr eyni deyil!");
            return;
        }

        try {
            await changePassword({
                oldPassword: oldPass,
                newPassword: newPass,
                confirmPassword: newPass2
            });

            setShowChangePassword(false);
            setShowSuccessModal(true);
            setOldPass('');
            setNewPass('');
            setNewPass2('');
        } catch (error) {
            console.error("Şifrə dəyişmə zamanı xəta:", error);
            alert("Şifrə dəyişdirilə bilmədi!");
        }
    };
    const navigate = useNavigate();
    return (
        <div id={"navbar"}>
            <nav className="navbar">
                <div className="navbar__logo">
                    <img src={logo} className="logo" alt="logo" />
                    <button className="mobile-menu-toggle" onClick={onToggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M0.5 1H11.5M0.5 4H11.5M0.5 7H11.5" stroke="#384871" stroke-miterlimit="10" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className={"navbar_right"}>
                    <div className={"notification"} onClick={()=>navigate("/customer/notification")}>
                           <div style={{
                               position:"relative",
                           }}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                   <path d="M12 4C10.4087 4 8.88258 4.63214 7.75736 5.75736C6.63214 6.88258 6 8.4087 6 10V18M12 4C13.5913 4 15.1174 4.63214 16.2426 5.75736C17.3679 6.88258 18 8.4087 18 10V18M12 4C12.2652 4 12.5196 3.89464 12.7071 3.70711C12.8946 3.51957 13 3.26522 13 3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3C11 3.26522 11.1054 3.51957 11.2929 3.70711C11.4804 3.89464 11.7348 4 12 4ZM20 18H4M14 20C14 20.5304 13.7893 21.0391 13.4142 21.4142C13.0391 21.7893 12.5304 22 12 22C11.4696 22 10.9609 21.7893 10.5858 21.4142C10.2107 21.0391 10 20.5304 10 20" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                               </svg>
                               {hasUnread && <div className="notification_red"></div>}
                           </div>

                        {isMobile ? "" : <div>
                            <h6>Bildirişlər</h6>
                        </div>}
                    </div>
                    <div className="navbar__profile" onClick={() => setShowProfilePopup(true)}>
                        <div className="navbar__profile-icon">
                            <img src={profileIcon} alt="Profile" className="icon" />
                        </div>
                        <div>
                            <span className="navbar__profile-name">{user?.name} {user?.surname}</span>
                            <br />
                            <span className="navbar__profile-email">+994 {user?.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </nav>

            {showProfilePopup && !showChangePassword && (
                <div className="modal-overlay" onClick={() => setShowProfilePopup(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowProfilePopup(false)}>×</button>
                        <div className="modal-header">
                            <img src={profileIcon} alt="" className="modal-icon" />
                            <div className={"user"}>
                                <strong>{user?.name} {user?.surname}</strong><br/>
                                <small>+994{user?.phoneNumber}</small>
                            </div>
                        </div>
                        <div className="modal-body">
                            <button
                                className="modal-btn"
                                onClick={() => { setShowProfilePopup(false); setShowChangePassword(true); }}
                            >
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M16.5 9C16.8978 9 17.2794 8.84196 17.5607 8.56066C17.842 8.27936 18 7.89782 18 7.5C18 7.10218 17.842 6.72064 17.5607 6.43934C17.2794 6.15804 16.8978 6 16.5 6C16.1022 6 15.7206 6.15804 15.4393 6.43934C15.158 6.72064 15 7.10218 15 7.5C15 7.89782 15.158 8.27936 15.4393 8.56066C15.7206 8.84196 16.1022 9 16.5 9Z" fill="black"/>
                                        <path d="M11.25 18V17.25H12.75C12.9489 17.25 13.1397 17.171 13.2803 17.0303C13.421 16.8897 13.5 16.6989 13.5 16.5V15H15C16.2599 14.9997 17.4878 14.6027 18.5095 13.8654C19.5311 13.1281 20.2948 12.0879 20.6922 10.8923C21.0895 9.6967 21.1004 8.40632 20.7233 7.20416C20.3462 6.00199 19.6002 4.94904 18.5912 4.1946C17.5821 3.44016 16.3611 3.02251 15.1014 3.00088C13.8416 2.97926 12.6071 3.35474 11.5727 4.0741C10.5383 4.79345 9.75662 5.82017 9.33846 7.00869C8.92031 8.1972 8.88691 9.48719 9.243 10.6957L3.4395 16.5C3.15818 16.7812 3.00008 17.1627 3 17.5605V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H7.5C7.89782 21 8.27936 20.842 8.56066 20.5607C8.84196 20.2794 9 19.8978 9 19.5V18.75H10.5C10.6989 18.75 10.8897 18.671 11.0303 18.5303C11.171 18.3897 11.25 18.1989 11.25 18ZM10.5 9C10.5 8.10998 10.7639 7.23995 11.2584 6.49993C11.7529 5.75991 12.4557 5.18314 13.2779 4.84254C14.1002 4.50195 15.005 4.41283 15.8779 4.58647C16.7508 4.7601 17.5526 5.18868 18.182 5.81802C18.8113 6.44736 19.2399 7.24918 19.4135 8.12209C19.5872 8.99501 19.4981 9.89981 19.1575 10.7221C18.8169 11.5443 18.2401 12.2471 17.5001 12.7416C16.76 13.2361 15.89 13.5 15 13.5H12.75C12.5511 13.5 12.3603 13.579 12.2197 13.7197C12.079 13.8603 12 14.0511 12 14.25V15.75H10.5C10.3011 15.75 10.1103 15.829 9.96967 15.9697C9.82902 16.1103 9.75 16.3011 9.75 16.5V17.25H8.25C8.05109 17.25 7.86032 17.329 7.71967 17.4697C7.57902 17.6103 7.5 17.8011 7.5 18V19.5H4.5V17.5605L10.6335 11.427C10.7362 11.3242 10.8068 11.1938 10.8368 11.0516C10.8667 10.9094 10.8547 10.7615 10.8022 10.626C10.6019 10.1073 10.4994 9.55602 10.5 9Z" fill="black"/>
                                    </svg> Şifrəni dəyiş
                                </div>
                                <span className="arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path d="M9.3241 15.1479L13.4777 10.9726L9.30234 6.81899" stroke="#212121" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
                                    </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/** 2️⃣ Şifrə Dəyiş Modalı **/}
            {showChangePassword && (
                <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowChangePassword(false)}>×</button>
                        <div className="modal-header">
                            <img src={profileIcon} alt="" className="modal-icon" />
                            <div className={"user"}>
                                <strong>{user?.name} {user?.surname}</strong><br/>
                                <small>+994{user?.phoneNumber}</small>
                            </div>
                        </div>
                        <form className="modal-form" onSubmit={handlePasswordSubmit}>
                            <label>
                                Mövcud şifrəni daxil et
                                <input
                                    type="password"
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    required
                                    placeholder={"* * * * * * *"}
                                />
                            </label>
                            <label>
                                Yeni şifrəni daxil et
                                <input
                                    type="password"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Yeni şifrəni yenidən daxil et <span>*</span>
                                <input
                                    type="password"
                                    value={newPass2}
                                    onChange={e => setNewPass2(e.target.value)}
                                    required
                                />
                            </label>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowChangePassword(false)}>
                                    Ləğv et
                                </button>
                                <button type="submit">
                                    Təsdiqlə
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/** 3️⃣ Uğur Mesajı Modalı **/}
            {showSuccessModal && (
                <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="modal-box modal-success" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <img src={profileIcon} alt="" className="modal-icon" />
                            <div className={"user"}>
                                <strong>{user?.name} {user?.surname}</strong><br/>
                                <small>+994{user?.phoneNumber}</small>
                            </div>
                        </div>
                        <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
                        <div className={"confirm-modal__iconHead"}>
                            <div className={"confirm-modal__iconMain"}>
                                <div className="confirm-modal__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                        <path d="M11.7714 19.3539L22.1402 8.9852C22.3849 8.74051 22.6704 8.61816 22.9966 8.61816C23.3229 8.61816 23.6083 8.74051 23.853 8.9852C24.0977 9.22989 24.2201 9.52066 24.2201 9.85752C24.2201 10.1944 24.0977 10.4847 23.853 10.7286L12.6279 21.9844C12.3832 22.2291 12.0977 22.3514 11.7714 22.3514C11.4452 22.3514 11.1597 22.2291 10.915 21.9844L5.65419 16.7235C5.4095 16.4788 5.29205 16.1885 5.30183 15.8524C5.31162 15.5164 5.43927 15.2256 5.68477 14.9801C5.93028 14.7346 6.22105 14.6123 6.5571 14.6131C6.89314 14.6139 7.1835 14.7362 7.42819 14.9801L11.7714 19.3539Z" fill="white"/>
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <p>Şifrə uğurla dəyişdirildi!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierNavbar;

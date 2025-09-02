import {useState} from 'react';
import './index.scss';
import {
    useGetAdminNotificationFighterQuery,
     useGetUserFightersQuery,
    useMarkAsReadMutation
} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const AccounterNotification = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of orders per page
    const companyId = Cookies.get("companyId");
    const {data:getUserFighters} = useGetUserFightersQuery()
    const user = getUserFighters?.data
    const fighterId = user?.id
    const {data:getAdminNotificationsFighter,refetch} = useGetAdminNotificationFighterQuery({fighterId,companyId})
    const notification = getAdminNotificationsFighter?.data
    const [markAsRead] = useMarkAsReadMutation()
    // Pagination logic

    const filteredNotifications = notification?.filter((n) => {
        const matchesSearch = n.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.productId === null ? "kateqoriya" : "məhsul").includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === "all" ? true :
                filter === "read" ? n.isRead :
                    filter === "unread" ? !n.isRead :
                        true;

        return matchesSearch && matchesFilter;
    }) || [];
    const totalPages = Math.ceil(filteredNotifications?.length / itemsPerPage);

    const paginatedNotifications = filteredNotifications?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 6; // Show up to 5 page numbers at a time
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < maxVisiblePages - 1) {
            if (startPage === 1) endPage = Math.min(maxVisiblePages, totalPages);
            else if (endPage === totalPages) startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (startPage > 2) pageNumbers.unshift('...');
        if (startPage > 1) pageNumbers.unshift(1);
        if (endPage < totalPages - 1) pageNumbers.push('...');
        if (endPage < totalPages) pageNumbers.push(totalPages);

        return pageNumbers;
    };
    const navigate = useNavigate()

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleMarkAsRead = async (n) => {
        try {
            await markAsRead(n.id);
            refetch();

            if (n.productId !== null) {
                navigate("/supplier/products/products", {
                    state: {
                        type: n.type, // create, update, delete
                        id: n.productId
                    }
                });
            } else if (n.categoryId !== null) {
                navigate("/supplier/products/categories", {
                    state: {
                        type: n.type,
                        id: n.categoryId
                    }
                });
            }else if (n.type === "order_created" && n.orderId) {
                console.log(n)
                if (n.status == true) {
                    navigate(`/supplier/history/${n.orderId}`);
                }else {
                    navigate(`/supplier/activeOrder/${n.orderId}`);
                }
            }
        } catch (error) {
            console.error("Bildiriş oxunarkən xəta baş verdi:", error);
        }
    };


    return (
        <div className={"super-admin-notification-main"}>
            <div className="super-admin-notification">
                <h2>Bildirişlər</h2>
                <p>Buradan son dəyişikliklər, sifarişlər və digər vacib məlumatlarla tanış ola bilərsiniz.</p>
                <div className="super-admin-notification__controls">
                    <input
                        type="text"
                        placeholder="Axtarış edin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Hamısı</option>
                        <option value="unread">Oxunmamış</option>
                        <option value="read">Oxunmuş</option>
                    </select>

                </div>
                <div className="notification-table-wrapper">
                    <div className="notification-table">
                        {paginatedNotifications?.map((n, index) => {
                            const iconColor = n.role === "customer" ? "red" : n.role === "admin" ? "blue" : "red";
                            return (
                            <div className={`notification-row ${n.isRead ? 'read' : 'unread'}`} key={n.id} onClick={() => handleMarkAsRead(n)}>
                                <div className="coll index">{index + 1}</div>

                                <div className="coll text">{iconColor === 'blue' ?
                                    <>
                                        <div className={`icon ${iconColor}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                                <path d="M2 0.5C1.60218 0.5 1.22064 0.658035 0.93934 0.93934C0.658035 1.22064 0.5 1.60218 0.5 2V15C0.5 15.3978 0.658035 15.7794 0.93934 16.0607C1.22064 16.342 1.60218 16.5 2 16.5H9C9.39782 16.5 9.77936 16.342 10.0607 16.0607C10.342 15.7794 10.5 15.3978 10.5 15V13.5C10.5 13.3674 10.4473 13.2402 10.3536 13.1464C10.2598 13.0527 10.1326 13 10 13C9.587 13 9.323 12.898 9.144 12.764C8.962 12.628 8.82067 12.4203 8.72 12.141C8.506 11.553 8.5 10.774 8.5 10C8.49999 9.93423 8.48699 9.8691 8.46177 9.80835C8.43655 9.74761 8.39958 9.69244 8.353 9.646L8.067 9.359L6.854 8.146C6.387 7.679 6.25 7.366 6.224 7.191C6.204 7.051 6.246 6.957 6.346 6.861C6.56 6.656 6.713 6.517 6.886 6.475C6.989 6.449 7.224 6.431 7.646 6.853L10.646 9.853C10.7398 9.94689 10.867 9.99968 10.9996 9.99978C11.0653 9.99982 11.1304 9.98693 11.1911 9.96183C11.2518 9.93673 11.307 9.89992 11.3535 9.8535C11.4 9.80708 11.4369 9.75195 11.4621 9.69127C11.4872 9.6306 11.5002 9.56555 11.5003 9.49985C11.5003 9.43416 11.4874 9.36909 11.4623 9.30838C11.4372 9.24766 11.4004 9.19249 11.354 9.146L10.5 8.293V5.207L13.06 7.767C13.1994 7.90627 13.3101 8.07166 13.3856 8.25372C13.4611 8.43577 13.5 8.63091 13.5 8.828V16C13.5 16.1326 13.5527 16.2598 13.6464 16.3536C13.7402 16.4473 13.8674 16.5 14 16.5C14.1326 16.5 14.2598 16.4473 14.3536 16.3536C14.4473 16.2598 14.5 16.1326 14.5 16V8.828C14.4999 8.16526 14.2366 7.52969 13.768 7.061L10.5 3.793V2C10.5 1.60218 10.342 1.22064 10.0607 0.93934C9.77936 0.658035 9.39782 0.5 9 0.5H2ZM9.5 4V7.293L8.354 6.146C7.776 5.568 7.2 5.369 6.649 5.503C6.54072 5.52958 6.43574 5.56815 6.336 5.618C5.88898 5.48829 5.41792 5.46438 4.96006 5.54815C4.50221 5.63192 4.07013 5.82108 3.698 6.10067C3.32587 6.38025 3.0239 6.74259 2.81597 7.15902C2.60805 7.57545 2.49987 8.03455 2.5 8.5C2.49996 9.07995 2.66802 9.64747 2.98383 10.1339C3.29964 10.6203 3.74967 11.0047 4.27945 11.2407C4.80923 11.4766 5.39604 11.554 5.96886 11.4633C6.54168 11.3727 7.07595 11.118 7.507 10.73C7.524 11.308 7.582 11.94 7.78 12.483C7.928 12.89 8.164 13.279 8.544 13.563L8.55 13.569C8.24549 13.6648 7.97947 13.8552 7.79063 14.1125C7.60179 14.3699 7.49998 14.6808 7.5 15V15.5H3.5V15C3.5 14.6022 3.34196 14.2206 3.06066 13.9393C2.77936 13.658 2.39782 13.5 2 13.5H1.5V3.5H2C2.39782 3.5 2.77936 3.34196 3.06066 3.06066C3.34196 2.77936 3.5 2.39782 3.5 2V1.5H7.5V2C7.5 2.39782 7.65804 2.77936 7.93934 3.06066C8.22064 3.34196 8.60218 3.5 9 3.5H9.5V4ZM9.5 15V15.009C9.49764 15.14 9.44392 15.2649 9.35041 15.3568C9.2569 15.4486 9.13106 15.5 9 15.5H8.5V15C8.5 14.8674 8.55268 14.7402 8.64645 14.6464C8.74021 14.5527 8.86739 14.5 9 14.5H9.5V15ZM3.5 8.5C3.50001 7.99138 3.69379 7.50188 4.04193 7.13108C4.39006 6.76028 4.86639 6.53604 5.374 6.504C5.25 6.734 5.187 7.014 5.235 7.337C5.306 7.819 5.613 8.32 6.146 8.853L7.053 9.76C6.79262 10.0809 6.43925 10.3132 6.04146 10.4251C5.64367 10.5369 5.22099 10.5229 4.83153 10.3847C4.44207 10.2466 4.10495 9.99128 3.86652 9.65378C3.62809 9.31629 3.50005 8.91322 3.5 8.5ZM2.5 1.5V2C2.5 2.13261 2.44732 2.25979 2.35355 2.35355C2.25979 2.44732 2.13261 2.5 2 2.5H1.5V2C1.5 1.86739 1.55268 1.74021 1.64645 1.64645C1.74021 1.55268 1.86739 1.5 2 1.5H2.5ZM1.5 14.5H2C2.13261 14.5 2.25979 14.5527 2.35355 14.6464C2.44732 14.7402 2.5 14.8674 2.5 15V15.5H2C1.86739 15.5 1.74021 15.4473 1.64645 15.3536C1.55268 15.2598 1.5 15.1326 1.5 15V14.5ZM9.5 2.5H9C8.86739 2.5 8.74021 2.44732 8.64645 2.35355C8.55268 2.25979 8.5 2.13261 8.5 2V1.5H9C9.13261 1.5 9.25979 1.55268 9.35355 1.64645C9.44732 1.74021 9.5 1.86739 9.5 2V2.5Z" fill="#384871"/>
                                            </svg>
                                        </div>
                                    </> : <>
                                        <div className={`icon ${iconColor}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                                <path d="M2 0.5C1.60218 0.5 1.22064 0.658035 0.93934 0.93934C0.658035 1.22064 0.5 1.60218 0.5 2V15C0.5 15.3978 0.658035 15.7794 0.93934 16.0607C1.22064 16.342 1.60218 16.5 2 16.5H9C9.39782 16.5 9.77936 16.342 10.0607 16.0607C10.342 15.7794 10.5 15.3978 10.5 15V13.5C10.5 13.3674 10.4473 13.2402 10.3536 13.1464C10.2598 13.0527 10.1326 13 10 13C9.587 13 9.323 12.898 9.144 12.764C8.962 12.628 8.82067 12.4203 8.72 12.141C8.506 11.553 8.5 10.774 8.5 10C8.49999 9.93423 8.48699 9.8691 8.46177 9.80835C8.43655 9.74761 8.39958 9.69244 8.353 9.646L8.067 9.359L6.854 8.146C6.387 7.679 6.25 7.366 6.224 7.191C6.204 7.051 6.246 6.957 6.346 6.861C6.56 6.656 6.713 6.517 6.886 6.475C6.989 6.449 7.224 6.431 7.646 6.853L10.646 9.853C10.7398 9.94689 10.867 9.99968 10.9996 9.99978C11.0653 9.99982 11.1304 9.98693 11.1911 9.96183C11.2518 9.93673 11.307 9.89992 11.3535 9.8535C11.4 9.80708 11.4369 9.75195 11.4621 9.69127C11.4872 9.6306 11.5002 9.56555 11.5003 9.49985C11.5003 9.43416 11.4874 9.36909 11.4623 9.30838C11.4372 9.24766 11.4004 9.19249 11.354 9.146L10.5 8.293V5.207L13.06 7.767C13.1994 7.90627 13.3101 8.07166 13.3856 8.25372C13.4611 8.43577 13.5 8.63091 13.5 8.828V16C13.5 16.1326 13.5527 16.2598 13.6464 16.3536C13.7402 16.4473 13.8674 16.5 14 16.5C14.1326 16.5 14.2598 16.4473 14.3536 16.3536C14.4473 16.2598 14.5 16.1326 14.5 16V8.828C14.4999 8.16526 14.2366 7.52969 13.768 7.061L10.5 3.793V2C10.5 1.60218 10.342 1.22064 10.0607 0.93934C9.77936 0.658035 9.39782 0.5 9 0.5H2ZM9.5 4V7.293L8.354 6.146C7.776 5.568 7.2 5.369 6.649 5.503C6.54072 5.52958 6.43574 5.56815 6.336 5.618C5.88898 5.48829 5.41792 5.46438 4.96006 5.54815C4.50221 5.63192 4.07013 5.82108 3.698 6.10067C3.32587 6.38025 3.0239 6.74259 2.81597 7.15902C2.60805 7.57545 2.49987 8.03455 2.5 8.5C2.49996 9.07995 2.66802 9.64747 2.98383 10.1339C3.29964 10.6203 3.74967 11.0047 4.27945 11.2407C4.80923 11.4766 5.39604 11.554 5.96886 11.4633C6.54168 11.3727 7.07595 11.118 7.507 10.73C7.524 11.308 7.582 11.94 7.78 12.483C7.928 12.89 8.164 13.279 8.544 13.563L8.55 13.569C8.24549 13.6648 7.97947 13.8552 7.79063 14.1125C7.60179 14.3699 7.49998 14.6808 7.5 15V15.5H3.5V15C3.5 14.6022 3.34196 14.2206 3.06066 13.9393C2.77936 13.658 2.39782 13.5 2 13.5H1.5V3.5H2C2.39782 3.5 2.77936 3.34196 3.06066 3.06066C3.34196 2.77936 3.5 2.39782 3.5 2V1.5H7.5V2C7.5 2.39782 7.65804 2.77936 7.93934 3.06066C8.22064 3.34196 8.60218 3.5 9 3.5H9.5V4ZM9.5 15V15.009C9.49764 15.14 9.44392 15.2649 9.35041 15.3568C9.2569 15.4486 9.13106 15.5 9 15.5H8.5V15C8.5 14.8674 8.55268 14.7402 8.64645 14.6464C8.74021 14.5527 8.86739 14.5 9 14.5H9.5V15ZM3.5 8.5C3.50001 7.99138 3.69379 7.50188 4.04193 7.13108C4.39006 6.76028 4.86639 6.53604 5.374 6.504C5.25 6.734 5.187 7.014 5.235 7.337C5.306 7.819 5.613 8.32 6.146 8.853L7.053 9.76C6.79262 10.0809 6.43925 10.3132 6.04146 10.4251C5.64367 10.5369 5.22099 10.5229 4.83153 10.3847C4.44207 10.2466 4.10495 9.99128 3.86652 9.65378C3.62809 9.31629 3.50005 8.91322 3.5 8.5ZM2.5 1.5V2C2.5 2.13261 2.44732 2.25979 2.35355 2.35355C2.25979 2.44732 2.13261 2.5 2 2.5H1.5V2C1.5 1.86739 1.55268 1.74021 1.64645 1.64645C1.74021 1.55268 1.86739 1.5 2 1.5H2.5ZM1.5 14.5H2C2.13261 14.5 2.25979 14.5527 2.35355 14.6464C2.44732 14.7402 2.5 14.8674 2.5 15V15.5H2C1.86739 15.5 1.74021 15.4473 1.64645 15.3536C1.55268 15.2598 1.5 15.1326 1.5 15V14.5ZM9.5 2.5H9C8.86739 2.5 8.74021 2.44732 8.64645 2.35355C8.55268 2.25979 8.5 2.13261 8.5 2V1.5H9C9.13261 1.5 9.25979 1.55268 9.35355 1.64645C9.44732 1.74021 9.5 1.86739 9.5 2V2.5Z" fill="#384871"/>
                                            </svg>
                                        </div>
                                    </>}<div>
                                    <h3>
                                        {n.role === "admin" ? "Super Admin" : "Sifarişçi"}
                                    </h3>
                                    <p>
                                        {n.type === "approve_create" && (n.productId === null
                                            ? "Kateqoriya yaratma istəyinizi təsdiqlədi"
                                            : "Məhsul yaratma istəyinizi təsdiqlədi")}

                                        {n.type === "approve_update" && (n.productId === null
                                            ? "Kateqoriya yeniləmə istəyinizi təsdiqlədi"
                                            : "Məhsul yeniləmə istəyinizi təsdiqlədi")}

                                        {n.type === "approve_delete" && (n.productId === null
                                            ? "Kateqoriya silmə istəyinizi təsdiqlədi"
                                            : "Məhsul silmə istəyinizi təsdiqlədi")}

                                        {n.type === "reject_create" && (n.productId === null
                                            ? "Kateqoriya yaratma istəyinizi rədd etdi"
                                            : "Məhsul yaratma istəyinizi rədd etdi")}

                                        {n.type === "reject_update" && (n.productId === null
                                            ? "Kateqoriya yeniləmə istəyinizi rədd etdi"
                                            : "Məhsul yeniləmə istəyinizi rədd etdi")}

                                        {n.type === "reject_delete" && (n.productId === null
                                            ? "Kateqoriya silmə istəyinizi rədd etdi"
                                            : "Məhsul silmə istəyinizi rədd etdi")}

                                        {n.type === "order_created" && "Yeni sifariş var. Təmin edin "}
                                    </p>

                                </div></div>
                                <div className="date">
                                    <h6>{n.createdDate.slice(0,10)}</h6>
                                        {!n.isRead && <div  className="dots"/>}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
                <div className="super-admin-notification__pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            disabled={page === '...'}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <div className={"xett"}></div>
        </div>
    );
};

export default AccounterNotification;
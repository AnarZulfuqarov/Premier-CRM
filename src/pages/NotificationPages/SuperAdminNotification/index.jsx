import {useState} from 'react';
import './index.scss';
import {useGetAdminNotificationsSuperAdminQuery, useMarkAsReadMutation} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";

const SuperAdminNotification = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of orders per page
    const {data:getAdminNotificationsSuperAdmin,refetch} = useGetAdminNotificationsSuperAdminQuery()
    const notification = getAdminNotificationsSuperAdmin?.data
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
                navigate("/superAdmin/products/products", {
                    state: {
                        type: n.type, // create, update, delete
                        id: n.productId
                    }
                });
            } else if (n.categoryId !== null) {
                navigate("/superAdmin/products/categories", {
                    state: {
                        type: n.type,
                        id: n.categoryId
                    }
                });
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
                        {filteredNotifications?.map((n, index) => {
                            const iconColor = n.role === "fighter" ? "red" : n.role === "customer" ? "blue" : "red";
                            return (
                            <div className={`notification-row ${n.isRead ? 'read' : 'unread'}`} key={n.id} onClick={() => handleMarkAsRead(n)}>
                                <div className="coll index">{index + 1}</div>

                                <div className="coll text">{iconColor === 'blue' ?
                                    <>
                                        <div className={`icon ${iconColor}`}>
                                            <svg  xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                <path d="M19.0969 13.8406C19.0382 13.773 18.9658 13.7187 18.8844 13.6815C18.803 13.6443 18.7145 13.6251 18.625 13.625H17.375V12.375C17.375 11.6862 16.8144 11.125 16.125 11.125H13.625C12.9356 11.125 12.375 11.6862 12.375 12.375V13.625H11.125C11.0354 13.625 10.9469 13.6442 10.8654 13.6814C10.7839 13.7186 10.7113 13.7729 10.6527 13.8406C10.594 13.9083 10.5505 13.9878 10.5253 14.0738C10.5 14.1597 10.4935 14.2501 10.5063 14.3388L11.1313 18.7137C11.1526 18.8626 11.2269 18.9988 11.3406 19.0973C11.4542 19.1958 11.5996 19.25 11.75 19.25H18C18.1504 19.25 18.2958 19.1958 18.4094 19.0973C18.5231 18.9988 18.5974 18.8626 18.6187 18.7137L19.2437 14.3388C19.2564 14.25 19.2498 14.1597 19.2245 14.0737C19.1992 13.9878 19.1556 13.9083 19.0969 13.8406ZM13.625 12.375H16.125V13.625H13.625V12.375ZM17.4581 18H12.2919L11.8456 14.875H17.9044L17.4581 18ZM6.75 13H8V19.25H6.75V13Z" fill="#384871"/>
                                                <path d="M10.9875 11.6719L9.79625 10.1819L8.895 7.92875C8.75654 7.58025 8.51643 7.28146 8.20589 7.07124C7.89535 6.86102 7.52875 6.74909 7.15375 6.75H3.625C2.59125 6.75 1.75 7.59125 1.75 8.625V13C1.75 13.6894 2.31062 14.25 3 14.25H3.625V19.25H4.875V13H3V8.625C3 8.45924 3.06585 8.30027 3.18306 8.18306C3.30027 8.06585 3.45924 8 3.625 8H7.15375C7.41062 8 7.63875 8.15437 7.73375 8.39312L8.76188 10.8906L10.0119 12.4531L10.9875 11.6719ZM3 3.625C3 2.24625 4.12125 1.125 5.5 1.125C6.87875 1.125 8 2.24625 8 3.625C8 5.00375 6.87875 6.125 5.5 6.125C4.12125 6.125 3 5.00375 3 3.625ZM4.25 3.625C4.25 4.31437 4.81063 4.875 5.5 4.875C6.18937 4.875 6.75 4.31437 6.75 3.625C6.75 2.93562 6.18937 2.375 5.5 2.375C4.81063 2.375 4.25 2.93562 4.25 3.625Z" fill="#384871"/>
                                            </svg>
                                        </div>
                                    </> : <>
                                        <div className={`icon ${iconColor}`}>
                                            <svg  xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                                 viewBox="0 0 19 19"
                                                 fill="none">
                                                <path
                                                    d="M13.25 8C14.4926 8 15.5 6.99264 15.5 5.75C15.5 4.50736 14.4926 3.5 13.25 3.5C12.0074 3.5 11 4.50736 11 5.75C11 6.99264 12.0074 8 13.25 8Z"
                                                    stroke="#FF5B5B" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                                <path
                                                    d="M5.75 15.5C6.99264 15.5 8 14.4926 8 13.25C8 12.0074 6.99264 11 5.75 11C4.50736 11 3.5 12.0074 3.5 13.25C3.5 14.4926 4.50736 15.5 5.75 15.5Z"
                                                    stroke="#FF5B5B" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                                <path
                                                    d="M11 11H15.5V14.75C15.5 14.9489 15.421 15.1397 15.2803 15.2803C15.1397 15.421 14.9489 15.5 14.75 15.5H11.75C11.5511 15.5 11.3603 15.421 11.2197 15.2803C11.079 15.1397 11 14.9489 11 14.75V11ZM3.5 3.5H8V7.25C8 7.44891 7.92098 7.63968 7.78033 7.78033C7.63968 7.92098 7.44891 8 7.25 8H4.25C4.05109 8 3.86032 7.92098 3.71967 7.78033C3.57902 7.63968 3.5 7.44891 3.5 7.25V3.5Z"
                                                    stroke="#FF5B5B" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                    </>}<div>
                                    <h3>Təchizatçı</h3>
                                    <p>
                                        {n.type === "create" && (n.productId === null
                                            ? "Yeni kateqoriya yaratmaq istəyir"
                                            : "Yeni məhsul yaratmaq istəyir")}
                                        {n.type === "update" && (n.productId === null
                                            ? "Mövcud kateqoriyanı yeniləmək istəyir"
                                            : "Mövcud məhsulu yeniləmək istəyir")}
                                        {n.type === "delete" && (n.productId === null
                                            ? "Mövcud kateqoriyanı silmək istəyir"
                                            : "Mövcud məhsulu silmək istəyir")}
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

            </div>

        </div>
    );
};

export default SuperAdminNotification;
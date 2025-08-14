import {useState} from 'react';
import './index.scss';
import {
    useGetAdminNotificationFighterQuery,
     useGetUserFightersQuery,
    useMarkAsReadMutation
} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const SupplierNotification = () => {
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                <g clip-path="url(#clip0_765_2945)">
                                                    <path d="M8.65546 8.72596C7.91244 8.72596 7.18612 8.50555 6.5684 8.09264C5.95069 7.67973 5.46933 7.09287 5.18525 6.4063C4.90116 5.71974 4.82711 4.96434 4.97247 4.23568C5.11783 3.50702 5.47607 2.83786 6.00185 2.31286C6.52763 1.78786 7.19732 1.43061 7.92619 1.28633C8.65507 1.14205 9.41036 1.21722 10.0965 1.50232C10.7826 1.78742 11.3688 2.26964 11.7808 2.88797C12.1928 3.5063 12.4121 4.23294 12.411 4.97596C12.4081 5.97058 12.0113 6.92354 11.3075 7.62632C10.6036 8.32911 9.65008 8.72449 8.65546 8.72596ZM8.65546 2.33151C8.13243 2.33151 7.62116 2.48661 7.18628 2.77718C6.7514 3.06776 6.41246 3.48076 6.21231 3.96397C6.01216 4.44718 5.95979 4.97889 6.06182 5.49186C6.16386 6.00483 6.41572 6.47603 6.78555 6.84586C7.15538 7.21569 7.62658 7.46755 8.13955 7.56959C8.65252 7.67162 9.18423 7.61926 9.66744 7.4191C10.1506 7.21895 10.5637 6.88001 10.8542 6.44513C11.1448 6.01025 11.2999 5.49898 11.2999 4.97596C11.2999 4.27461 11.0213 3.60198 10.5254 3.10605C10.0294 2.61012 9.35681 2.33151 8.65546 2.33151Z" fill="#384871"/>
                                                    <path d="M9.62244 18.0997C9.50102 17.9783 9.40736 17.8319 9.3479 17.6708C9.28844 17.5097 9.26459 17.3376 9.27799 17.1664H2.72244V13.9553C3.50995 13.1145 4.46536 12.4485 5.52673 12.0006C6.58811 11.5527 7.73176 11.3328 8.88355 11.3553H9.28355C9.25805 11.169 9.27586 10.9794 9.3356 10.8011C9.39534 10.6228 9.4954 10.4608 9.62799 10.3275L9.69466 10.2664C9.43355 10.2664 9.13911 10.233 8.88355 10.233C7.52822 10.2009 6.18267 10.4703 4.9442 11.0218C3.70573 11.5733 2.60529 12.3931 1.72244 13.4219C1.65032 13.5181 1.61133 13.6351 1.61133 13.7553V17.1664C1.61133 17.4611 1.72839 17.7437 1.93676 17.9521C2.14514 18.1604 2.42775 18.2775 2.72244 18.2775H9.778L9.62244 18.0997Z" fill="#384871"/>
                                                    <path d="M19.2113 13.4561L18.1002 13.1172C18.0208 12.8455 17.9128 12.5829 17.778 12.3339L18.3335 11.3006C18.3516 11.2592 18.356 11.2132 18.346 11.1692C18.336 11.1252 18.3121 11.0856 18.278 11.0561L17.4724 10.2506C17.442 10.2176 17.4013 10.1958 17.3569 10.1888C17.3126 10.1817 17.2672 10.1898 17.228 10.2117L16.2058 10.7672C15.9543 10.6251 15.6879 10.5115 15.4113 10.4284L15.0724 9.31725C15.058 9.27635 15.0308 9.24123 14.9947 9.21718C14.9586 9.19314 14.9157 9.18146 14.8724 9.18391H13.7335C13.6898 9.18341 13.6471 9.19726 13.612 9.22335C13.5768 9.24944 13.5512 9.28633 13.5391 9.32836L13.2002 10.4395C12.9219 10.5204 12.6536 10.6322 12.4002 10.7728L11.3891 10.2172C11.3507 10.1958 11.3062 10.1879 11.2629 10.195C11.2195 10.2021 11.1798 10.2236 11.1502 10.2561L10.328 11.0561C10.2975 11.0882 10.2779 11.1291 10.2719 11.173C10.2659 11.2169 10.2739 11.2615 10.2946 11.3006L10.8502 12.3117C10.7034 12.5622 10.5859 12.8288 10.5002 13.1061L9.38909 13.4395C9.34706 13.4516 9.31017 13.4772 9.28408 13.5123C9.25799 13.5475 9.24414 13.5902 9.24464 13.6339V14.7728C9.24793 14.8129 9.26358 14.8511 9.28946 14.8819C9.31533 14.9128 9.35014 14.9348 9.38909 14.945L10.5002 15.2839C10.5823 15.5564 10.6941 15.8191 10.8335 16.0672L10.278 17.1284C10.2568 17.1664 10.2486 17.2103 10.2546 17.2534C10.2606 17.2965 10.2805 17.3365 10.3113 17.3672L11.1169 18.1728C11.1483 18.2042 11.1889 18.2248 11.2328 18.2318C11.2767 18.2388 11.3217 18.2318 11.3613 18.2117L12.4002 17.6561C12.6473 17.7895 12.908 17.8956 13.178 17.9728L13.5113 19.0839C13.525 19.125 13.551 19.161 13.5858 19.1868C13.6205 19.2126 13.6624 19.2271 13.7058 19.2284H14.8446C14.8882 19.228 14.9305 19.2138 14.9654 19.1878C15.0003 19.1619 15.0261 19.1255 15.0391 19.0839L15.378 17.945C15.6441 17.8671 15.9011 17.7609 16.1446 17.6284L17.1946 18.1839C17.2332 18.2044 17.2775 18.2117 17.3206 18.2047C17.3638 18.1977 17.4034 18.1767 17.4335 18.145L18.278 17.3895C18.3007 17.3569 18.3128 17.3181 18.3128 17.2784C18.3128 17.2386 18.3007 17.1999 18.278 17.1672L17.7224 16.1228C17.8573 15.8777 17.9653 15.6188 18.0446 15.3506L19.1558 15.0117C19.1978 14.9995 19.2347 14.9739 19.2608 14.9388C19.2869 14.9037 19.3007 14.861 19.3002 14.8172V13.6506C19.3053 13.6131 19.2997 13.5749 19.2839 13.5405C19.2682 13.5061 19.243 13.4768 19.2113 13.4561ZM14.3058 16.0561C13.9383 16.0572 13.5788 15.9492 13.2728 15.7457C12.9668 15.5423 12.7281 15.2525 12.587 14.9132C12.4458 14.574 12.4086 14.2004 12.48 13.8399C12.5515 13.4795 12.7283 13.1484 12.9881 12.8885C13.248 12.6287 13.5791 12.4518 13.9396 12.3804C14.3 12.309 14.6736 12.3462 15.0129 12.4873C15.3521 12.6285 15.6419 12.8672 15.8454 13.1732C16.0488 13.4792 16.1569 13.8387 16.1558 14.2061C16.1543 14.6963 15.9589 15.166 15.6123 15.5127C15.2657 15.8593 14.796 16.0547 14.3058 16.0561Z" fill="#384871"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_765_2945">
                                                        <rect width="20" height="20" fill="white" transform="translate(0.5 0.5)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </> : <>
                                        <div className={`icon ${iconColor}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                <path d="M19.0969 13.8406C19.0382 13.773 18.9658 13.7187 18.8844 13.6815C18.803 13.6443 18.7145 13.6251 18.625 13.625H17.375V12.375C17.375 11.6862 16.8144 11.125 16.125 11.125H13.625C12.9356 11.125 12.375 11.6862 12.375 12.375V13.625H11.125C11.0354 13.625 10.9469 13.6442 10.8654 13.6814C10.7839 13.7186 10.7113 13.7729 10.6527 13.8406C10.594 13.9083 10.5505 13.9878 10.5253 14.0738C10.5 14.1597 10.4935 14.2501 10.5063 14.3388L11.1313 18.7137C11.1526 18.8626 11.2269 18.9988 11.3406 19.0973C11.4542 19.1958 11.5996 19.25 11.75 19.25H18C18.1504 19.25 18.2958 19.1958 18.4094 19.0973C18.5231 18.9988 18.5974 18.8626 18.6187 18.7137L19.2437 14.3388C19.2564 14.25 19.2498 14.1597 19.2245 14.0737C19.1992 13.9878 19.1556 13.9083 19.0969 13.8406ZM13.625 12.375H16.125V13.625H13.625V12.375ZM17.4581 18H12.2919L11.8456 14.875H17.9044L17.4581 18ZM6.75 13H8V19.25H6.75V13Z" fill="#DE7272"/>
                                                <path d="M10.9875 11.6719L9.79625 10.1819L8.895 7.92875C8.75654 7.58025 8.51643 7.28146 8.20589 7.07124C7.89535 6.86102 7.52875 6.74909 7.15375 6.75H3.625C2.59125 6.75 1.75 7.59125 1.75 8.625V13C1.75 13.6894 2.31062 14.25 3 14.25H3.625V19.25H4.875V13H3V8.625C3 8.45924 3.06585 8.30027 3.18306 8.18306C3.30027 8.06585 3.45924 8 3.625 8H7.15375C7.41062 8 7.63875 8.15437 7.73375 8.39312L8.76188 10.8906L10.0119 12.4531L10.9875 11.6719ZM3 3.625C3 2.24625 4.12125 1.125 5.5 1.125C6.87875 1.125 8 2.24625 8 3.625C8 5.00375 6.87875 6.125 5.5 6.125C4.12125 6.125 3 5.00375 3 3.625ZM4.25 3.625C4.25 4.31437 4.81063 4.875 5.5 4.875C6.18937 4.875 6.75 4.31437 6.75 3.625C6.75 2.93562 6.18937 2.375 5.5 2.375C4.81063 2.375 4.25 2.93562 4.25 3.625Z" fill="#DE7272"/>
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

export default SupplierNotification;
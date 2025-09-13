import {useEffect, useMemo, useState} from 'react';
import './index.scss';
import {
    useGetAdminNotificationsAccountantQuery,
    useGetUserAccountantsQuery,
    useGetMyOrdersIdQuery,
    useMarkAsReadMutation, useGetMyOrdersIdAccounterQuery,
} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const ITEMS_PER_PAGE = 4;

// ---- helpers ----
const formatDate = (input) => {
    if (!input) return '';
    const isDDMM = typeof input === 'string' && /^\d{2}\.\d{2}\.\d{4}/.test(input);
    let d;
    if (isDDMM) {
        const [datePart] = input.split(' ');
        const [dd, mm, yyyy] = datePart.split('.');
        d = new Date(`${yyyy}-${mm}-${dd}`);
    } else {
        d = new Date(input);
    }
    if (isNaN(d.getTime())) return input;
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${dd}.${mm}.${yyyy}`;
};

// Order obyekti müxtəlif strukturlarda gələ bilər – bu helper son ödənişi tapır
// (artıq istifadə etmirik, amma istəsən saxlaya bilərsən)
const pickLastPaymentDate = (order) => {
    if (!order) return null;
    if (order.lastPaymentDate) return order.lastPaymentDate;
    if (order.lastPaidAt) return order.lastPaidAt;
    if (order.lastPaymentAt) return order.lastPaymentAt;
    if (order.payment?.lastPaymentDate) return order.payment.lastPaymentDate;
    if (order.order?.lastPaymentDate) return order.order.lastPaymentDate;

    const payments = order.payments || order.orderPayments || order.paymentHistory || [];
    if (Array.isArray(payments) && payments.length) {
        const getTs = (p) => new Date(p.paidAt || p.createdAt || p.date || p.paymentDate || p.time || 0).getTime();
        const latest = payments.reduce((a, b) => (getTs(a) > getTs(b) ? a : b));
        const last = latest?.paidAt || latest?.createdAt || latest?.date || latest?.paymentDate || null;
        if (last) return last;
    }
    return null;
};

// ---- child row (hook burada çağırılır; lazy YOXDUR) ----
const NotificationRow = ({ n, rowNumber, onClick }) => {
    const { data: orderResp, isFetching } = useGetMyOrdersIdAccounterQuery(n?.orderId, { skip: !n?.orderId });

    // Backenddən bəzən { data: {...} } gəlir, bəzən birbaşa obyekt – hər ikisini tuturuq
    const order = orderResp?.data ?? orderResp;

    // İstədiyin sahə: orderLastDeliveryDate (fallback: lastDeliveryDate)
    const lastDeliveryRaw =
        order?.orderLastDeliveryDate ||
        order?.order?.orderLastDeliveryDate ||
        order?.lastDeliveryDate ||
        null;

    const iconColor =
        n.role === 'customer' ? 'red' :
            n.role === 'admin' ? 'blue' : 'red';

    return (
        <div
            className={`notification-row ${n.isRead ? 'read' : 'unread'}`}
            onClick={() => onClick(n)}
            key={n.id}
        >
            <div className="coll index">{rowNumber}</div>

            <div className="coll text">
                <div className={`icon ${iconColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M5 2.5C4.60218 2.5 4.22064 2.65804 3.93934 2.93934C3.65804 3.22064 3.5 3.60218 3.5 4V17C3.5 17.3978 3.65804 17.7794 3.93934 18.0607C4.22064 18.342 4.60218 18.5 5 18.5H12C12.3978 18.5 12.7794 18.342 13.0607 18.0607C13.342 17.7794 13.5 17.3978 13.5 17V15.5C13.5 15.3674 13.4473 15.2402 13.3536 15.1464C13.2598 15.0527 13.1326 15 13 15C12.587 15 12.323 14.898 12.144 14.764C11.962 14.628 11.8207 14.4203 11.72 14.141C11.506 13.553 11.5 12.774 11.5 12C11.5 11.9342 11.487 11.8691 11.4618 11.8084C11.4365 11.7476 11.3996 11.6924 11.353 11.646L11.067 11.359L9.854 10.146C9.387 9.679 9.25 9.366 9.224 9.191C9.204 9.051 9.246 8.957 9.346 8.861C9.56 8.656 9.713 8.517 9.886 8.475C9.989 8.449 10.224 8.431 10.646 8.853L13.646 11.853C13.7398 11.9469 13.867 11.9997 13.9996 11.9998C14.0653 11.9998 14.1304 11.9869 14.1911 11.9618C14.2518 11.9367 14.307 11.8999 14.3535 11.8535C14.4 11.8071 14.4369 11.752 14.4621 11.6913C14.4872 11.6306 14.5002 11.5656 14.5003 11.4999C14.5003 11.4342 14.4874 11.3691 14.4623 11.3084C14.4372 11.2477 14.4004 11.1925 14.354 11.146L13.5 10.293V7.207L16.06 9.767C16.1994 9.90627 16.3101 10.0717 16.3856 10.2537C16.4611 10.4358 16.5 10.6309 16.5 10.828V18C16.5 18.1326 16.5527 18.2598 16.6464 18.3536C16.7402 18.4473 16.8674 18.5 17 18.5C17.1326 18.5 17.2598 18.4473 17.3536 18.3536C17.4473 18.2598 17.5 18.1326 17.5 18V10.828C17.4999 10.1653 17.2366 9.52969 16.768 9.061L13.5 5.793V4C13.5 3.60218 13.342 3.22064 13.0607 2.93934C12.7794 2.65804 12.3978 2.5 12 2.5H5ZM12.5 6V9.293L11.354 8.146C10.776 7.568 10.2 7.369 9.649 7.503C9.54072 7.52958 9.43574 7.56815 9.336 7.618C8.88898 7.48829 8.41792 7.46438 7.96006 7.54815C7.50221 7.63192 7.07013 7.82108 6.698 8.10067C6.32587 8.38025 6.0239 8.74259 5.81597 9.15902C5.60805 9.57545 5.49987 10.0345 5.5 10.5C5.49996 11.0799 5.66802 11.6475 5.98383 12.1339C6.29964 12.6203 6.74967 13.0047 7.27945 13.2407C7.80923 13.4766 8.39604 13.554 8.96886 13.4633C9.54168 13.3727 10.0759 13.118 10.507 12.73C10.524 13.308 10.582 13.94 10.78 14.483C10.928 14.89 11.164 15.279 11.544 15.563L11.55 15.569C11.2455 15.6648 10.9795 15.8552 10.7906 16.1125C10.6018 16.3699 10.5 16.6808 10.5 17V17.5H6.5V17C6.5 16.6022 6.34196 16.2206 6.06066 15.9393C5.77936 15.658 5.39782 15.5 5 15.5H4.5V5.5H5C5.39782 5.5 5.77936 5.34196 6.06066 5.06066C6.34196 4.77936 6.5 4.39782 6.5 4V3.5H10.5V4C10.5 4.39782 10.658 4.77936 10.9393 5.06066C11.2206 5.34196 11.6022 5.5 12 5.5H12.5V6ZM12.5 17V17.009C12.4976 17.14 12.4439 17.2649 12.3504 17.3568C12.2569 17.4486 12.1311 17.5 12 17.5H11.5V17C11.5 16.8674 11.5527 16.7402 11.6464 16.6464C11.7402 16.5527 11.8674 16.5 12 16.5H12.5V17ZM6.5 10.5C6.50001 9.99138 6.69379 9.50188 7.04193 9.13108C7.39006 8.76028 7.86639 8.53604 8.374 8.504C8.25 8.734 8.187 9.014 8.235 9.337C8.306 9.819 8.613 10.32 9.146 10.853L10.053 11.76C9.79262 12.0809 9.43925 12.3132 9.04146 12.4251C8.64367 12.5369 8.22099 12.5229 7.83153 12.3847C7.44207 12.2466 7.10495 11.9913 6.86652 11.6538C6.62809 11.3163 6.50005 10.9132 6.5 10.5ZM5.5 3.5V4C5.5 4.13261 5.44732 4.25979 5.35355 4.35355C5.25979 4.44732 5.13261 4.5 5 4.5H4.5V4C4.5 3.86739 4.55268 3.74021 4.64645 3.64645C4.74021 3.55268 4.86739 3.5 5 3.5H5.5ZM4.5 16.5H5C5.13261 16.5 5.25979 16.5527 5.35355 16.6464C5.44732 16.7402 5.5 16.8674 5.5 17V17.5H5C4.86739 17.5 4.74021 17.4473 4.64645 17.3536C4.55268 17.2598 4.5 17.1326 4.5 17V16.5ZM12.5 4.5H12C11.8674 4.5 11.7402 4.44732 11.6464 4.35355C11.5527 4.25979 11.5 4.13261 11.5 4V3.5H12C12.1326 3.5 12.2598 3.55268 12.3536 3.64645C12.4473 3.74021 12.5 3.86739 12.5 4V4.5Z" fill="#FF5B5B"/>
                    </svg>
                </div>

                <div>
                    <p>
                        {n.type === 'order_created' && 'Yeni sifariş var. Təmin edin '}
                        {n.type === 'upcoming_payment' && 'Ödəniş tarixinin yaxınlaşması haqqında xatırlatma'}
                    </p>

                    {n.orderId && (
                        <small className="muted">
                            Sifariş ID: {n.orderId} • Son çatdırılma tarixi:&nbsp;
                            {isFetching ? 'yüklənir…' : (lastDeliveryRaw ? formatDate(lastDeliveryRaw) : '—')}
                        </small>
                    )}
                </div>
            </div>

            <div className="date">
                <h6>{(n.createdDate ?? '').slice(0, 10)}</h6>
                {!n.isRead && <div className="dots" />}
            </div>
        </div>
    );
};

const AccounterNotification = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const companyId = Cookies.get("companyId");
    const {data:getUserAccountants} = useGetUserAccountantsQuery();
    const user = getUserAccountants?.data;
    const fighterId = user?.id;

    const {data:getAdminNotificationsFighter, refetch} = useGetAdminNotificationsAccountantQuery();
    const notifications = getAdminNotificationsFighter?.data ?? [];

    const [markAsRead] = useMarkAsReadMutation();

    const filteredNotifications = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return notifications.filter((n) => {
            const matchesSearch =
                (n.type?.toLowerCase() ?? '').includes(term) ||
                ((n.productId === null ? "kateqoriya" : "məhsul").includes(term)) ||
                ((n.orderId ?? '').toLowerCase().includes(term));

            const matchesFilter =
                filter === "all" ? true :
                    filter === "read" ? n.isRead :
                        !n.isRead;

            return matchesSearch && matchesFilter;
        });
    }, [notifications, searchTerm, filter]);

    const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE) || 1;

    const paginatedNotifications = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredNotifications, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, filter]);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 6;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < maxVisiblePages - 1) {
            if (startPage === 1) endPage = Math.min(maxVisiblePages, totalPages);
            else if (endPage === totalPages) startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        if (startPage > 2) pageNumbers.unshift('...');
        if (startPage > 1) pageNumbers.unshift(1);
        if (endPage < totalPages - 1) pageNumbers.push('...');
        if (endPage < totalPages) pageNumbers.push(totalPages);
        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleMarkAsRead = async (n) => {
        try {
            await markAsRead(n.id);
            refetch();
            navigate("/accounter/borc");
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
                        {paginatedNotifications.map((n, idx) => (
                            <NotificationRow
                                key={n.id}
                                n={n}
                                rowNumber={(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                onClick={handleMarkAsRead}
                            />
                        ))}
                    </div>
                </div>

                <div className="super-admin-notification__pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
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

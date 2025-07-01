import {useState} from 'react';
import './index.scss';

const SuperAdminNotification = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Number of orders per page


    const arr = [
        1, 2, 3, 4, 5
    ]
    // Pagination logic
    const totalPages = Math.ceil(arr.length / itemsPerPage);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // Show up to 5 page numbers at a time
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

    const handlePageChange = (page) => {
        if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const notifications = [
        {
            id: 1,
            icon: 'blue', // or 'red'
            text: 'Təchizatçı məhsul yaratmaq istəyir',
            date: '03.06.2025',
            isRead: false,
        },
        {
            id: 2,
            icon: 'red',
            text: 'Təchizatçı kateqoriya yaratmaq istəyir',
            date: '03.06.2025',
            isRead: true,
        },
        {
            id: 3,
            icon: 'blue', // or 'red'
            text: 'Təchizatçı məhsul yaratmaq istəyir',
            date: '03.06.2025',
            isRead: false,
        },
        {
            id: 4,
            icon: 'red',
            text: 'Təchizatçı kateqoriya yaratmaq istəyir',
            date: '03.06.2025',
            isRead: true,
        },
        {
            id: 5,
            icon: 'blue', // or 'red'
            text: 'Təchizatçı məhsul yaratmaq istəyir',
            date: '03.06.2025',
            isRead: false,
        },
        {
            id: 6,
            icon: 'red',
            text: 'Təchizatçı kateqoriya yaratmaq istəyir',
            date: '03.06.2025',
            isRead: true,
        },
    ];
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
                        <option value="pending">Sifarişçidən təhvil gözləyən</option>
                        <option value="completed">Tamamlanmış</option>
                    </select>
                </div>
                <div className="notification-table-wrapper">
                    <div className="notification-table">
                        {notifications.map((n, index) => (
                            <div className={`notification-row ${n.isRead ? 'read' : 'unread'}`} key={n.id}>
                                <div className="coll index">{index + 1}</div>

                                <div className="coll text">{n.icon === 'blue' ?
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                             viewBox="0 0 19 19" fill="none">
                                            <g clip-path="url(#clip0_243_21267)">
                                                <path
                                                    d="M12.3125 0.517578L18.5 3.61133V10.5107L17.375 9.94824V4.86816L12.875 7.11816V9.38574L11.75 9.94824V7.11816L7.25 4.86816V6.86328L6.125 6.30078V3.61133L12.3125 0.517578ZM12.3125 6.14258L13.8682 5.36035L9.79883 3.03125L7.94434 3.96289L12.3125 6.14258ZM15.0811 4.7627L16.6807 3.96289L12.3125 1.77441L11.0029 2.43359L15.0811 4.7627ZM10.625 10.5107L9.5 11.0732V11.0645L6.125 12.752V16.751L9.5 15.0547V16.3203L5.5625 18.2891L0.5 15.749V9.80762L5.5625 7.27637L10.625 9.80762V10.5107ZM5 16.751V12.752L1.625 11.0645V15.0547L5 16.751ZM5.5625 11.7764L8.80566 10.1592L5.5625 8.5332L2.31934 10.1592L5.5625 11.7764ZM10.625 11.7676L14.5625 9.79883L18.5 11.7676V16.3994L14.5625 18.3682L10.625 16.3994V11.7676ZM14 16.8301V14.1494L11.75 13.0244V15.7051L14 16.8301ZM17.375 15.7051V13.0244L15.125 14.1494V16.8301L17.375 15.7051ZM14.5625 13.1738L16.6807 12.1104L14.5625 11.0557L12.4443 12.1104L14.5625 13.1738Z"
                                                    fill="#384871"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_243_21267">
                                                    <rect width="18" height="18" fill="white"
                                                          transform="translate(0.5 0.5)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </> : <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
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
                                    </>}{n.text}</div>
                                <div className="coll date">
                                    {n.date}
                                    {!n.isRead && <span className="dot"/>}
                                </div>
                            </div>
                        ))}
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

export default SuperAdminNotification;
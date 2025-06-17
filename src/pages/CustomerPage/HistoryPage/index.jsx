import React, { useState } from 'react';
import './index.scss';

const OrderHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page

    const orders = [
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təsdiq gözləyən',
        },
        {
            id: 'NP764543702736',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınan',
        },
        {
            id: 'NP764543702737',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təsdiq gözləyən',
        },
        {
            id: 'NP764543702738',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınan',
        },
        {
            id: 'NP764543702739',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınmayan',
        },
        {
            id: 'NP764543702740',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınan',
        },
        {
            id: 'NP764543702741',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təsdiq gözləyən',
        },
        {
            id: 'NP764543702742',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınan',
        },
        {
            id: 'NP764543702743',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınmayan',
        },
        {
            id: 'NP764543702744',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təhvil alınan',
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Təsdiq gözləyən') ||
            (filter === 'completed' && order.status === 'Təhvil alınan') ||
            (filter === 'not-completed' && order.status === 'Təhvil alınmayan');
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

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

    return (
        <div className={"order-history-main"}>
            <div className="order-history">
                <h2>Tarixçə</h2>
                <p>Aşağıdan müşahidə seçərək yeni sifarişlərinizi təxminə bilərsiniz</p>
                <div className="order-history__controls">
                    <input
                        type="text"
                        placeholder="Axtarış edin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Hamısı</option>
                        <option value="pending">Təsdiq gözləyən</option>
                        <option value="completed">Təhvil alınan</option>
                        <option value="not-completed">Təhvil alınmayan</option>
                    </select>
                </div>
                <div className="order-history__list">
                    {paginatedOrders.map((order, index) => (
                        <div key={order.id || index} className="order-history__item">
                            <div className="order-history__details">
                                <p className="order-history__id">
                                    <span>Order ID</span> {order.id}
                                </p>
                                <span
                                    className={`order-history__status ${
                                        order.status === 'Təhvil alınan'
                                            ? 'completed'
                                            : order.status === 'Təsdiq gözləyən'
                                                ? 'pending'
                                                : 'not-completed'
                                    }`}
                                >
                {order.status}
              </span>
                            </div>
                            <div className="order-history__data">
                                <p>{order.product}</p>
                                <p>{order.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-history__pagination">
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

export default OrderHistory;
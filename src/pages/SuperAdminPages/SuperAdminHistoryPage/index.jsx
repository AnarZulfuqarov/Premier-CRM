import React, { useState } from 'react';
import './index.scss';

const OrderHistorySuperAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page

    const orders = [
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təchizatçıdan təsdiq gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702736',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702737',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Sifarişçidən təhvil gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702738',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702740',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təchizatçıdan təsdiq gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702741',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Sifarişçidən təhvil gözləyən',
            price:"325"
        },
        {
            id: 'NP764543702742',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
        {
            id: 'NP764543702744',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
            price:"325"
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış') ||
            (filter === 'pending' && order.status === 'Təchizatçıdan təsdiq gözləyən');
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
        <div className={"order-history-super-admin-main"}>
            <div className="order-history-super-admin">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                <div className="order-history-super-admin__controls">
                    <input
                        type="text"
                        placeholder="Axtarış edin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Hamısı</option>
                        <option value="pending">Sifarişçidən təhvil gözləyən</option>
                        <option value="pending">Təchizatçıdan təsdiq gözləyən</option>
                        <option value="completed">Tamamlanmış</option>
                    </select>
                </div>
                <div className="order-history-super-admin__list">
                    {paginatedOrders.map((order, index) => (
                        <div key={order.id || index} className="order-history-super-admin__item">
                            <div className={"techizat"}>
                                <div className={"order-history-super-admin__ids"}>
                                    <p className="order-history-super-admin__id">
                                        <span>Təchizatçının adı:</span> {order.id}
                                    </p>
                                    <p className="order-history-super-admin__id">
                                        <span>Sifarişçinin adı:</span> {order.price} ₼
                                    </p>
                                </div>
                            </div>
                            <div className="order-history-super-admin__details">
                                <div className={"order-history-super-admin__ids"}>
                                    <p className="order-history-super-admin__id">
                                        <span>Order ID</span> {order.id}
                                    </p>
                                    <p className="order-history-super-admin__id">
                                        <span>Ümumi məbləğ:</span> {order.price} ₼
                                    </p>
                                </div>
                                <span
                                    className={`order-history-super-admin__status ${
                                        order.status === 'Tamamlanmış'
                                            ? 'completed'
                                            : order.status === 'Sifarişçidən təhvil gözləyən'
                                                ? 'pending'
                                                : 'pending'
                                    }`}
                                >
                {order.status}
              </span>
                            </div>
                            <div className="order-history-super-admin__data">
                                <p>{order.product}</p>
                                <p>{order.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-history-super-admin__pagination">
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

export default OrderHistorySuperAdmin;
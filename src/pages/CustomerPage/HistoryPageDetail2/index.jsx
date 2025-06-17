import {useState} from 'react';
import './index.scss';
import {NavLink} from "react-router-dom";

const OrderHistoryDetailTwo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of table rows per page

    const order = {
        id: 'NP764543702735',
        product: 'Kartoşka, subun, səftəli, qab yuyan...',
        quantity: '5 kateqoriya, 36 ədəd məhsul',
        status: 'Təsdiq gözləyən',
        items: [
            {name: 'Sabun', category: 'Tamizlik', quantity: '15 ədəd'},
            {name: 'Səftəka', category: 'Tamizlik', quantity: '15 ədəd'},
            {name: 'Qab yuyan', category: 'Tamizlik', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
            {name: 'Kartoşka', category: 'Kartoşka', quantity: '15 ədəd'},
        ],
    };

    // Pagination logic for table items
    const totalPages = Math.ceil(order.items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = order.items.slice(startIndex, endIndex);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
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
        <div className="order-history-detail-main">
            <div className="order-history-detail">
                <h2><NavLink className={"link"} to={"/admin/history"}>— Tarixçə</NavLink> — Sifariş detalları</h2>

                <div className="order-history-detail__list">
                    <div className="order-history-detail__item">
                        <div className="order-history-detail__details">
                            <p className="order-history-detail__id">
                                <span>Order ID</span> {order.id}
                            </p>
                            <span className="order-history-detail__status pending">{order.status}</span>
                        </div>
                        <div className="order-history-detail__data">
                            <p>{order.product}</p>
                            <p>{order.quantity}</p>
                        </div>

                    </div>
                </div>
                <table className="order-history-detail__table">
                    <thead>
                    <tr>
                        <th>Məhsulun adı <input type="text" placeholder="Q"/></th>
                        <th>Kateqoriyası <input type="text" placeholder="Q"/></th>
                        <th>Miqdar <input type="text" placeholder="Q"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="order-history-detail__actions">
                    <span>Sifariş təchaiatlarına görə qəbul edilib. Davam etmək üçün siz də təsdiq etmalısınız.</span>
                    <button className="order-history-detail__confirm">Təsdiq et</button>
                </div>
                <div className="order-history-detail__pagination">
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
            <div className="xett"></div>
        </div>
    );
};

export default OrderHistoryDetailTwo;
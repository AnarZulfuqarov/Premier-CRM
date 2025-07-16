import React, {useEffect, useState} from 'react';
import './index.scss';
import {useGetMyOrdersQuery} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";

const OrderHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page
    const navigate = useNavigate();
    const {data:getMyOrders,refetch} = useGetMyOrdersQuery()
    const orderss = getMyOrders?.data
    useEffect(() => {
        refetch()
    }, []);
    const orders = orderss?.map((order) => {
        let status = '';
        if (order.employeeConfirm && order.fighterConfirm && order.employeeDelivery) {
            status = 'Tamamlanmış';
        } else if (order.employeeConfirm && order.fighterConfirm) {
            status = 'Təhvil alınmayan';
        } else if (order.employeeConfirm && !order.fighterConfirm) {
            status = 'Təchizatçıdan təsdiq gözləyən';
        }

        const uniqueCategories = [
            ...new Set(order.items.map(item => item.product?.categoryName).filter(Boolean))
        ];

        const totalPrice = order.items.reduce((sum, item) => sum + (item.price || 0), 0);
        const vendorName = order.fighterInfo ? `${order.fighterInfo.name} ${order.fighterInfo.surname}` : null;

        return {
            id: order.id,
            product: order.items.map(item => item.product?.name).join(', '),
            itemCount: order.items.length,
            categoryCount: uniqueCategories.length,
            status,
            totalPrice,
            vendorName,
        };
    }) || [];



    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Təchizatçıdan təsdiq gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış') ||
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
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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
                    <div className="order-history__filter-button">
                        <button className="filter-icon" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                <path d="M7 14H11V12H7V14ZM3 8H15V6H3V8ZM0 0V2H18V0H0Z" fill="black"/>
                            </svg>
                        </button>

                        {showFilterDropdown && (
                            <div className="filter-dropdown">
                                <button
                                    className={filter === 'all' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('all');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                    Hamısı
                                </button>
                                <button
                                    className={filter === 'pending' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('pending');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                  <div className={"statuss pending"}></div>  Təchizatçıdan təsdiq gözləyən
                                </button>
                                <button
                                    className={filter === 'completed' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('completed');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                   <div className={"statuss completed"}></div> Tamamlanmış
                                </button>
                                <button
                                    className={filter === 'not-completed' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('not-completed');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                   <div className={"statuss not-completed"}></div> Təhvil alınmayan
                                </button>
                            </div>
                        )}
                    </div>


                </div>
                <div className="order-history__list">
                    {paginatedOrders.map((order, index) => (
                        <div key={order.id || index} className="order-history__item" onClick={()=>navigate(`/customer/history/${order.id}`)}>
                            {['Tamamlanmış', 'Təhvil alınmayan'].includes(order.status) && (

                                <p className="order-history__id-tech">
                                    <span>Təchizatçının adı:</span>{order.vendorName || '—'}
                                </p>

                            )}
                            <div className="order-history__details">

                               <div style={{display:"flex",gap:"40px"}}> <p className="order-history__id">
                                   <span>Order ID</span> {order.id}
                               </p>

                                   {['Tamamlanmış', 'Təhvil alınmayan'].includes(order.status) && (

                                       <p className="order-history__id">
                                           <span>Ümumi məbləğ:</span> {order.totalPrice} ₼
                                       </p>

                                   )}

                               </div>

                                <span className={`order-history__status ${
                                    order.status === 'Tamamlanmış'
                                        ? 'completed'
                                        : order.status === 'Təchizatçıdan təsdiq gözləyən'
                                            ? 'pending'
                                            : 'not-completed'
                                }`}>
    {order.status}
  </span>
                            </div>

                            <div className="order-history__data">
                                <p>{order.product}</p>
                                <p>
                                    <span className="quantity-count">{order.itemCount}</span>{' '}
                                    <span className="quantity-label">məhsul,</span>{' '}
                                    <span className="quantity-count">{order.categoryCount}</span>{' '}
                                    <span className="quantity-label">kateqoriya</span>
                                </p>

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
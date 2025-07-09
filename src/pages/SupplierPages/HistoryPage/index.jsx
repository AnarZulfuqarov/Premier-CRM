import React, { useState } from 'react';
import './index.scss';
import {useGetOrdersQuery} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";

const OrderHistorySupplier = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page
    const {data:getOrders ,refetch} = useGetOrdersQuery()
    const orderss = getOrders?.data
    const orders = orderss
        ?.filter(order => order.employeeConfirm && order.fighterConfirm) // Yalnız təsdiqlənənlər
        .map(order => {
            const isDelivered = order.employeeDelivery;

            let status = '';
            if (isDelivered) {
                status = 'Tamamlanmış';
            } else {
                status = 'Sifarişçidən təhvil gözləyən';
            }

            const totalPrice = order.items?.reduce((sum, item) => sum + item.price, 0) || 0;
            const productNames = order.items?.map(item => item.product?.name).join(', ');
            const totalQuantity = order.items?.length;

            const customerFullName = `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`;
            const supplierFullName = `${order.fighterInfo?.name || ''} ${order.fighterInfo?.surname || ''}`;

            return {
                id: order.id,
                product: productNames,
                quantity: `${totalQuantity} məhsul`,
                status,
                price: totalPrice,
                customer: customerFullName,
                supplier: supplierFullName
            };
        }) || [];




    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış');
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
    const navigate = useNavigate()
    return (
        <div className={"order-history-main-supplier"}>
            <div className="order-history-supplier">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                <div className="order-history-supplier__controls">
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
                <div className="order-history-supplier__list">
                    {paginatedOrders.map((order, index) => (
                        <div key={order.id || index} className="order-history-supplier__item" onClick={()=>navigate(`/supplier/history/${order.id}`)}>
                            <div className={"techizat"}>
                                <div className={"order-history-supplier__ids"}>
                                    <p className="order-history-supplier__id">
                                        <span>Təchizatçının adı:</span> {order.supplier}
                                    </p>
                                    <p className="order-history-supplier__id">
                                        <span>Sifarişçinin adı:</span> {order.customer}
                                    </p>
                                </div>
                            </div>
                            <div className="order-history-supplier__details">
                                <div className={"order-history-supplier__ids"}>
                                    <p className="order-history-supplier__id">
                                        <span>Order ID</span> {order.id}
                                    </p>
                                    <p className="order-history-supplier__id">
                                        <span>Ümumi məbləğ:</span> {order.price} ₼
                                    </p>
                                </div>
                                <span
                                    className={`order-history-supplier__status ${
                                        order.status === 'Tamamlanmış'
                                            ? 'completed'
                                            : order.status === 'Sifarişçidən təhvil gözləyən'
                                                ? 'pending'
                                                : 'not-completed'
                                    }`}
                                >
                {order.status}
              </span>
                            </div>
                            <div className="order-history-supplier__data">
                                <p>{order.product}</p>
                                <p>{order.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-history-supplier__pagination">
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

export default OrderHistorySupplier;
import React, {useEffect, useState} from 'react';
import './index.scss';
import {useNavigate} from "react-router-dom";
import { useGetOrdersQuery} from "../../../services/adminApi.jsx";

const OrderHistorySuperAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of orders per page
    const navigate = useNavigate();
    const {data:getMyOrders,refetch} = useGetOrdersQuery()
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
                        <div key={order.id || index} className="order-history-super-admin__item" onClick={()=>navigate(`/superAdmin/history/${order.id}`)}>
                            <div className={"techizat"}>
                                <div className={"order-history-super-admin__ids"}>
                                    <p className="order-history-super-admin__id">
                                        <span>Təchizatçının adı:</span> {order.supplier}
                                    </p>
                                    <p className="order-history-super-admin__id">
                                        <span>Sifarişçinin adı:</span> {order.customer}
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
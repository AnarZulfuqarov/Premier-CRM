import React, { useState } from 'react';
import './index.scss';
import {useGetOrdersQuery} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";

const OrderHistorySupplier = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
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

            const totalPrice = order.items?.reduce((sum, item) =>
                sum + item.suppliedQuantity * (item?.price || 0), 0
            ) || 0;
            const productNames = order.items?.map(item => item.product?.name).join(', ');
            const totalQuantity = order.items?.length;

            const customerFullName = `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`;
            const supplierFullName = `${order.fighterInfo?.name || ''} ${order.fighterInfo?.surname || ''}`;
            const uniqueCategories = [
                ...new Set(order.items.map(item => item.product?.categoryName).filter(Boolean))
            ];
            return {
                id: order.id,
                product: productNames,
                itemCount: order.items.length,
                status,
                categoryCount: uniqueCategories.length,
                price: totalPrice.toFixed(2),
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
    const paginatedOrders = filteredOrders;

    // Generate page numbers with ellipsis

    const navigate = useNavigate()
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const isMobile = window.innerWidth <= 768;
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
                                    <div className={"statuss pending"}></div> Sifarişçidən təhvil gözləyən
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
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-history-supplier__list">
                    {filteredOrders.map((order, index) => (
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
                                {isMobile ? ("") : (
                                    <div
                                        className={`order-history-supplier__status ${
                                            order.status === 'Tamamlanmış'
                                                ? 'completed'
                                                : order.status === 'Sifarişçidən təhvil gözləyən'
                                                    ? 'pending'
                                                    : 'not-completed'
                                        }`}
                                    >
                                        {order.status}
                                    </div>
                                )}
                            </div>
                            <div className="order-history-supplier__data">
                                <p>{order.product}</p>
                                <p>
                                    <span className="quantity-count">{order.itemCount}</span>{' '}
                                    <span className="quantity-label">məhsul,</span>{' '}
                                    <span className="quantity-count">{order.categoryCount}</span>{' '}
                                    <span className="quantity-label">kateqoriya</span>
                                </p>
                            </div>
                            {isMobile ? (<div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:"end",
                                marginTop:"10px"
                            }}>
                                <div
                                    className={`order-history-supplier__status ${
                                        order.status === 'Tamamlanmış'
                                            ? 'completed'
                                            : order.status === 'Sifarişçidən təhvil gözləyən'
                                                ? 'pending'
                                                : 'not-completed'
                                    }`}
                                >
                                    {order.status}
                                </div>
                            </div>): ("")}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistorySupplier;
import  {useEffect, useState} from 'react';
import './index.scss';
import {
    useGetAllCompaniesQuery, useGetOrderByPageAccounterQuery, useGetOrderByPageByCompanyAccounterQuery,
} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router-dom";

const OrderHistoryAccounter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {data: getAllCompanies} = useGetAllCompaniesQuery()
    const companies = getAllCompanies?.data
    const [selectedCompany, setSelectedCompany] = useState('all');
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [filter, setFilter] = useState('all');
    const commonParams = {page, pageSize, companyName: selectedCompany};

    const {data: pagedOrdersData, isFetching} =
        selectedCompany === 'all'
            ? useGetOrderByPageAccounterQuery({page, pageSize})
            : useGetOrderByPageByCompanyAccounterQuery(commonParams);
    useEffect(() => {
        setAllOrders([]);
        setPage(1);
    }, [selectedCompany]);

    const [allOrders, setAllOrders] = useState([]);
    useEffect(() => {
        if (pagedOrdersData?.data?.length) {
            setAllOrders(prev => [...prev, ...pagedOrdersData.data]);
        }
    }, [pagedOrdersData]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                !isFetching
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetching]);

    const orderss = allOrders
    const orders = orderss?.map(order => {
        const isPaid = order.isPaid === true;
        const isUnpaid = order.isPaid === false;

        let status = '';
        if (isPaid) status = 'Ödənilib';
        else if (isUnpaid) status = 'Ödənilməyib';
        else if (order.employeeDelivery) status = 'Tamamlanmış';
        else status = 'Sifarişçidən təhvil gözləyən';

        const totalPrice = order.items?.reduce((s, i) =>
            s + (i.suppliedQuantity || 0) * (i?.price || 0), 0) || 0;

        return {
            id: order.id,
            product: (() => {
                const names = order.items?.map(i => i.product?.name).filter(Boolean) ?? [];
                return names.length > 2 ? names.slice(0, 2).join(', ') + '...' : names.join(', ');
            })(),
            itemCount: order.items?.length ?? 0,
            status,
            price: totalPrice.toFixed(2),
            customer: `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`,
            supplier: `${order.fighterInfo?.name || ''} ${order.fighterInfo?.surname || ''}`,
            paymentStatus: isPaid ? 'Ödənilib' : (isUnpaid ? 'Ödənilməyib' : null), // ✅ YENİ
            order
        };
    }) || [];


    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.product.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'supplier_pending' && o.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && o.status === 'Tamamlanmış') ||
            (filter === 'unpaid' && o.status === 'Ödənilməyib') ||
            (filter === 'paid' && o.status === 'Ödənilib');

        const matchesCompany =
            selectedCompany === 'all' ||
            o?.order?.section?.companyName === selectedCompany;

        return matchesSearch && matchesFilter && matchesCompany;
    });


    // Pagination logic
    const paginatedOrders = filteredOrders;

    // Generate page numbers with ellipsis

    const navigate = useNavigate()
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const isMobile = window.innerWidth <= 768;
    return (
        <div className={"order-history-accounter-main"}>
            <div className="order-history-accounter">
                <h2>Tarixçə</h2>
                <p>Sifarişlərin bütün mərhələlər üzrə vəziyyəti bu bölmədə əks olunur.</p>
                <div className="order-history-accounter__controls">
                    <input
                        type="text"
                        placeholder="Axtarış edin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="company-select">
                        <label>Şirkət seçin:</label>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                            <option value="all">Hamısı</option>
                            {companies?.map(company => (
                                <option key={company.id} value={company.name}>{company.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="order-history__filter-button">
                        <button className="filter-icon" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14"
                                 fill="none">
                                <path d="M7 14H11V12H7V14ZM3 8H15V6H3V8ZM0 0V2H18V0H0Z" fill="black"/>
                            </svg>
                        </button>

                        {showFilterDropdown && (
                            <div className="filter-dropdown">
                                <button className={filter === 'all' ? 'active' : ''} onClick={() => {
                                    setFilter('all');
                                    setShowFilterDropdown(false);
                                }}>
                                    Hamısı
                                </button>
                                <button className={filter === 'supplier_pending' ? 'active' : ''} onClick={() => {
                                    setFilter('supplier_pending');
                                    setShowFilterDropdown(false);
                                }}>
                                    <div className="statuss pending"></div>
                                    Sifarişçidən təhvil gözləyən
                                </button>
                                <button className={filter === 'completed' ? 'active' : ''} onClick={() => {
                                    setFilter('completed');
                                    setShowFilterDropdown(false);
                                }}>
                                    <div className="statuss completed"></div>
                                    Tamamlanmış
                                </button>
                                <button className={filter === 'unpaid' ? 'active' : ''} onClick={() => {
                                    setFilter('unpaid');
                                    setShowFilterDropdown(false);
                                }}>
                                    <div className="statuss unpaid"></div>
                                    Ödənilməyib
                                </button>
                                <button className={filter === 'paid' ? 'active' : ''} onClick={() => {
                                    setFilter('paid');
                                    setShowFilterDropdown(false);
                                }}>
                                    <div className="statuss paid"></div>
                                    Ödənilib
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-history-accounter__list">
                    {filteredOrders.map((order, index) => (
                        <div key={order.id || index} className="order-history-accounter__item"
                             onClick={() => navigate(`/accounter/history/${order.id}`)}>
                            <div className={"techizat"}>
                                <div className={"order-history-accounter__ids"}>
                                    <p className="order-history-accounter__id">
                                        <span>Təchizatçının adı:</span> {order.supplier}
                                    </p>
                                    <p className="order-history-accounter__id">
                                        <span>Sifarişçinin adı:</span> {order.customer}
                                    </p>
                                </div>
                            </div>
                            <div className="order-history-accounter__details">
                                <div className={"order-history-accounter__ids"}>
                                    <p className="order-history-accounter__id">
                                        <span>Order ID</span> {order.id}
                                    </p>
                                    <p className="order-history-accounter__id">
                                        <span>Ümumi məbləğ:</span> {order.price} ₼
                                        {order.paymentStatus && (
                                            <span
                                                className={`price-status ${order.paymentStatus === 'Ödənilib' ? 'paid' : 'unpaid'}`}>
      {' ('}{order.paymentStatus.toLowerCase()}{')'}
    </span>
                                        )}
                                    </p>

                                </div>
                                {isMobile ? ("") : (
                                    <div
                                        className={`order-history-accounter__status ${
                                            order.status === 'Sifarişçidən təhvil gözləyən' ? 'pending' :
                                                order.status === 'Tamamlanmış' ? 'completed' :
                                                    order.status === 'Ödənilməyib' ? 'unpaid' :
                                                        order.status === 'Ödənilib' ? 'paid' : ''
                                        }`}
                                    >
                                        {order.status}
                                    </div>

                                )}
                            </div>
                            <div className="order-history-accounter__data">
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
                                justifyContent: "end",
                                marginTop: "10px"
                            }}>
                                <div
                                    className={`order-history-accounter__status ${
                                        order.status === 'Sifarişçidən təhvil gözləyən' ? 'pending' :
                                            order.status === 'Tamamlanmış' ? 'completed' :
                                                order.status === 'Ödənilməyib' ? 'unpaid' :
                                                    order.status === 'Ödənilib' ? 'paid' : ''
                                    }`}
                                >
                                    {order.status}
                                </div>

                            </div>) : ("")}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryAccounter;
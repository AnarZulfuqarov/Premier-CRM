import {useEffect, useRef, useState} from 'react';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {useGetAllCompaniesQuery, useGetOrdersQuery,useGetOrderByPageByCompanyQuery,
    useGetOrderByPageQuery} from "../../../services/adminApi.jsx";

const OrderHistorySuperAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const {data:getAllCompanies} = useGetAllCompaniesQuery()
    const companies = getAllCompanies?.data
    const [selectedCompany, setSelectedCompany] = useState('all');
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [allOrders, setAllOrders] = useState([]);

    const commonParams = { page, pageSize, companyName: selectedCompany };

    const { data: pagedOrdersData, isFetching ,refetch} =
        selectedCompany === 'all'
            ? useGetOrderByPageQuery({ page, pageSize })
            : useGetOrderByPageByCompanyQuery(commonParams);
    useEffect(() => {
        setAllOrders([]);
        setPage(1);
    }, [selectedCompany]);

    const listRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const onScroll = () => {
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
            if (nearBottom && !isFetching && hasMore) {
                setPage(prev => prev + 1);
            }
        };

        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [isFetching, hasMore]);

// Hər səhifə gələndə listə əlavə et və "hasMore"u güncəllə
    useEffect(() => {
        const pageData = pagedOrdersData?.data ?? [];
        if (pageData.length) {
            setAllOrders(prev => {
                // duplikatları önlə (id ilə)
                const seen = new Set(prev.map(o => o.id));
                const next = pageData.filter(o => !seen.has(o.id));
                return [...prev, ...next];
            });
            if (pageData.length < pageSize) setHasMore(false);
        } else if (page > 1) {
            setHasMore(false);
        }
    }, [pagedOrdersData]);

    const orderss = selectedCompany === 'all' ? pagedOrdersData?.data : allOrders;

    useEffect(() => {
        refetch()
    }, [orderss]);
    const orders = orderss?.map((order) => {
        let status = '';
        if (order.employeeConfirm && order.fighterConfirm && order.employeeDelivery) {
            status = 'Tamamlanmış';
        } else if (order.employeeConfirm && order.fighterConfirm) {
            status = 'Sifarişçidən təhvil gözləyən';
        } else if (order.employeeConfirm && !order.fighterConfirm) {
            status = 'Təchizatçıdan təsdiq gözləyən';
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
            categoryCount: uniqueCategories.length,
            status,
            price: totalPrice.toFixed(2),
            customer: customerFullName,
            supplier: supplierFullName,
            order
        };
    }) || [];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Təchizatçıdan təsdiq gözləyən') ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış');

        const matchesCompany =
            selectedCompany === 'all' ||
            order?.order?.section?.companyName === selectedCompany;
        return matchesSearch && matchesFilter && matchesCompany;
    });



    // Pagination logic

    // Generate page numbers with ellipsis

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
                                    className={filter === 'pending' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('pending');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                    <div className={"statuss pending"}></div> Sifarişçidən təhvil gözləyən
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-history-super-admin__list" ref={listRef}>
                    {filteredOrders.map((order, index) => (
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
            </div>
        </div>
    );
};

export default OrderHistorySuperAdmin;
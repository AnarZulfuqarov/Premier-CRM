import {useState} from 'react';
import './index.scss';
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useGetAllVendorsIdQuery, useGetOrdersVendorQuery} from "../../../services/adminApi.jsx";

const VendorHistorySupplier = () => {
    const {id} = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const {data: getAllVendorsId} = useGetAllVendorsIdQuery(id)
    const vendor = getAllVendorsId?.data

    const {data: getOrdersVendor} = useGetOrdersVendorQuery(id)
    const orderData = getOrdersVendor?.data
    const orders = orderData
        ?.filter(order => order.employeeConfirm && order.fighterConfirm) // yalnız uyğun olanları saxla
        ?.map(order => {
            const status = order.employeeDelivery ? 'Tamamlanmış' : 'Sifarişçidən təhvil gözləyən';
            const productNames = order.items?.map(i => i.product?.name).join(', ');
            const quantity = `${new Set(order.items.map(i => i.product?.categoryName)).size} kateqoriya, ${order.items.length} məhsul`;
            const totalPrice = order.items?.reduce((sum, item) =>
                sum + item.suppliedQuantity * (item?.price || 0), 0
            ) || 0;
            const supplierName = `${order.fighterInfo?.name || ''} ${order.fighterInfo?.surname || ''}`;
            const customerName = `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`;

            return {
                id: order.id,
                product: productNames,
                quantity,
                status,
                price: totalPrice.toFixed(2),
                supplier: supplierName,
                customer: customerName
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
    const paginatedOrders = filteredOrders; // yani direkt tüm filtrelenmiş veriyi göster

    // Generate page numbers with ellipsis

    const navigate = useNavigate()
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const isMobile = window.innerWidth <= 768;
    return (
        <div className={"vendor-detail-main"}>
            <div className="vendor-detail">
                <div className={'path'}>
                    <h2>
                        <NavLink className="link" to="/supplier/products/vendors">— Vendorlar</NavLink>{' '}
                        — {vendor?.name}
                    </h2>
                </div>
                <h3>Vendorlar</h3>
                <p>Mövcud vendor məlumatlarını bu bölmədən nəzərdən keçirə bilərsiniz</p>
                <div className="vendor-detail__controls">
                    <input
                        type="text"
                        placeholder="Axtarış edin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="order-history__filter-button">
                        <button className="filter-icon" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14"
                                 fill="none">
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
                                    <div className={"statuss pending"}></div>
                                    Sifarişçidən təhvil gözləyən
                                </button>
                                <button
                                    className={filter === 'completed' ? 'active' : ''}
                                    onClick={() => {
                                        setFilter('completed');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                    <div className={"statuss completed"}></div>
                                    Tamamlanmış
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="vendor-detail__list">
                    {paginatedOrders.map((order, index) => (
                        <div key={order.id || index} className="vendor-detail__item"
                             onClick={() => navigate(`/supplier/vendor/${id}/${order.id}`)}>
                            <div className="techizat">
                                <div className="vendor-detail__ids">
                                    <p className="vendor-detail__id">
                                        <span>Təchizatçının adı:</span> {order.supplier}
                                    </p>
                                    <p className="vendor-detail__id">
                                        <span>Sifarişçinin adı:</span> {order.customer}
                                    </p>
                                </div>
                            </div>
                            <div className="vendor-detail__details">
                                <div className="vendor-detail__ids">
                                    <p className="vendor-detail__id">
                                        <span>Order ID</span> {order.id}
                                    </p>
                                    <p className="vendor-detail__id">
                                        <span>Ümumi məbləğ:</span> {order.price} ₼
                                    </p>
                                </div>
                                {isMobile ? ("") : (<div className={`vendor-detail__status ${
                                    order.status === 'Tamamlanmış' ? 'completed' :
                                        order.status === 'Sifarişçidən təhvil gözləyən' ? 'pending' : ''
                                }`}>
                                    {order.status}
                                </div>)}
                            </div>
                            <div className="vendor-detail__data">
                                <p>{order.product}</p>
                                <p>{order.quantity}</p>
                            </div>
                            {isMobile ? (<div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:"end"
                            }}>
                                <div className={`vendor-detail__status ${
                                    order.status === 'Tamamlanmış' ? 'completed' :
                                        order.status === 'Sifarişçidən təhvil gözləyən' ? 'pending' : ''
                                }`}>
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

export default VendorHistorySupplier;
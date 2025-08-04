import  { useState } from 'react';
import './index.scss';
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useGetAllVendorsIdQuery, useGetOrdersVendorQuery} from "../../../services/adminApi.jsx";

const VendorHistorySuperAdmin =() => {
    const {id} = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const {data:getAllVendorsId} = useGetAllVendorsIdQuery(id)
    const vendor = getAllVendorsId?.data

    const {data:getOrdersVendor} = useGetOrdersVendorQuery(id)
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


    const navigate = useNavigate()

    return (
        <div className={"vendor-detail-super-admin-main"}>
            <div className="vendor-detail-super-admin">
                <div className={'path'}>
                    <h2>
                        <NavLink className="link" to="/superAdmin/products/vendors">— Vendorlar</NavLink>{' '}
                        — {vendor?.name}
                    </h2>
                </div>
                <h3>Vendorlar</h3>
                <p>Mövcud vendor məlumatlarını bu bölmədən nəzərdən keçirə bilərsiniz</p>
                <div className="vendor-detail-super-admin__controls">
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
                <div className="vendor-detail-super-admin__list">
                    {filteredOrders.map((order, index) => (
                        <div key={order.id || index} className="vendor-detail-super-admin__item" onClick={()=>navigate(`/superAdmin/vendor/${id}/${order.id}`)}>
                            <div className={"techizat"}>
                                <div className={"vendor-detail-super-admin__ids"}>
                                    <p className="vendor-detail-super-admin__id">
                                        <span>Təchizatçının adı:</span> {order.id}
                                    </p>
                                    <p className="vendor-detail-super-admin__id">
                                        <span>Sifarişçinin adı:</span> {order.price} ₼
                                    </p>
                                </div>
                            </div>
                            <div className="vendor-detail-super-admin__details">
                                <div className={"vendor-detail-super-admin__ids"}>
                                    <p className="vendor-detail-super-admin__id">
                                        <span>Order ID</span> {order.id}
                                    </p>

                                </div>
                                <span
                                    className={`vendor-detail-super-admin__status ${
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
                            <div className="vendor-detail-super-admin__data">
                                <p>{order.product}</p>
                                <p>{order.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorHistorySuperAdmin;
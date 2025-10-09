import { useRef, useState } from 'react';
import './index.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useGetAllVendorsIdQuery, useGetOrdersVendorQuery } from '../../../services/adminApi.jsx';

const VendorHistorySupplier = () => {
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const { data: getAllVendorsId } = useGetAllVendorsIdQuery(id);
    const vendor = getAllVendorsId?.data;

    const { data: getOrdersVendor } = useGetOrdersVendorQuery(id);
    const orderData = getOrdersVendor?.data;

    // Gələn data strukturuna uyğunlaşdırılmış transformasiya
    const orders =
        orderData
            ?.filter((order) => order.employeeConfirm && order.fighterConfirm)
            ?.map((order) => {
                const status = order.employeeDelivery
                    ? 'Tamamlanmış'
                    : 'Sifarişçidən təhvil gözləyən';

                const productNames = order.items?.map((i) => i.product?.name).join(', ') || '';

                const quantity = `${new Set(
                    order.items.map((i) => i.product?.categoryName)
                ).size} kateqoriya, ${order.items.length} məhsul`;

                const totalPrice =
                    order.items?.reduce(
                        (sum, item) => sum + item.suppliedQuantity * (item?.price || 0),
                        0
                    ) || 0;

                return {
                    id: order.id,
                    createdDate: order.createdDate,
                    companyName: order.section?.companyName,
                    totalAmount: totalPrice.toFixed(2) + ' ₼',
                    customer:
                        `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`.trim(),
                    supplier:
                        `${order.fighterInfo?.name || ''} ${order.fighterInfo?.surname || ''}`.trim(),
                    product: productNames,
                    quantity,
                    status,
                };
            }) || [];

    const listRef = useRef(null);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && order.status === 'Sifarişçidən təhvil gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış');
        return matchesSearch && matchesFilter;
    });

    const navigate = useNavigate();

    return (
        <div className="vendor-detail-super-admin-main">
            <div className="vendor-detail-super-admin">
                <div className="path">
                    <h2>
                        <NavLink className="link" to="/supplier/products/vendors">
                            — Vendorlar
                        </NavLink>{' '}
                        — {vendor?.name}
                    </h2>
                </div>

                <h3>Vendorlar</h3>
                <p>Mövcud vendor məlumatlarını bu bölmədən nəzərdən keçirə bilərsiniz</p>

                {/* Axtarış və filter */}
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

                {/* Cədvəl */}
                <div className="order-history-super-admin__table-wrap" ref={listRef}>
                    <table className="ohsa-table">
                        <thead>
                        <tr>
                            <th>Tarixi</th>
                            <th>Şirkət adı</th>
                            <th>Ümumi məbləğ</th>
                            <th>Sifarişçinin adı</th>
                            <th>Təchizatçının adı</th>
                            <th>Order ID</th>
                            <th className="status-col">Status</th>
                            <th className="sticky-right">Sifariş detalı</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((o, i) => (
                            <tr
                                key={o.id ?? i}
                                onClick={() => navigate(`/superAdmin/history/${o.id}`)}
                            >
                                <td>{o.createdDate}</td>
                                <td>{o.companyName}</td>
                                <td>{o.totalAmount}</td>
                                <td>{o.customer || '-'}</td>
                                <td>{o.supplier || '-'}</td>
                                <td>{o.id.slice(0, 8)}</td>
                                <td className="status-col">
                    <span
                        className={
                            'status-badge ' +
                            (o.status === 'Tamamlanmış' ? 'completed' : 'pending')
                        }
                    >
                      {o.status}
                    </span>
                                </td>
                                <td className="sticky-right sticky-col">
                                    <button
                                        className="detail-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/supplier/history/${o.id}`);
                                        }}
                                    >
                                        Detallı bax
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="ohsa-empty">Məlumat tapılmadı</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorHistorySupplier;

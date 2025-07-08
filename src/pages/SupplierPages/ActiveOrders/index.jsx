import './index.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useGetOrdersQuery} from "../../../services/adminApi.jsx";

const ActiveOrders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 9;
    const {data:getOrders,refetch} = useGetOrdersQuery()
    const orderss = getOrders?.data
    const orders = orderss?.map(order => {
        const amount = order.items.reduce((sum, item) => {
            return sum + item.price;
        }, 0);

        return {
            id: order.id,
            company: order.section?.companyName || '—',
            person: `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`,
            amount: amount,
            orderDate: order.createdDate,
            deliveryDate: order.orderLimitTime,
        };
    }) || [];


    const totalPages = Math.ceil(orders.length / pageSize);
    const pagedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="active-order-main">
            <div className="active-order">
                <h2>Aktiv sifarişlər</h2>
                <p>Aşağıdan məhsulları seçərək yeni sifarişinizi tamamlaya bilərsiniz</p>

                <div className="order-table-wrapper">
                    <div className="scrollable-part">
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Sifariş verən şirkət</th>
                                <th>Sifarişi verən şəxs</th>
                                <th>Sifarişin ümumi məbləği</th>
                                <th>Sifariş tarixi</th>
                                <th>Çatdırılacaq tarix</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedOrders.map((order, idx) => (
                                <tr key={order.id}>
                                    <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td>{order.company}</td>
                                    <td>{order.person}</td>
                                    <td>{order.amount} ₼</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.deliveryDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fixed-column">
                        <div className="header">Sifariş detalları</div>
                        {pagedOrders.map((order) => (
                            <div key={order.id} className="cell">
                                <button onClick={() => navigate(`/supplier/activeOrder/${order.id}`)}>Ətraflı bax</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="active-order__pagination">
                    <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                </div>
            </div>
            <div className="xett"></div>
        </div>
    );
};

export default ActiveOrders;

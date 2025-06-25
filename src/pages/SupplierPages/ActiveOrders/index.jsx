import './index.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveOrders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 9;

    const orders = Array.from({ length: 30 }, (_, idx) => ({
        id: `75875058252${idx + 10}`,
        company: 'Şirvanşah',
        person: 'Allahverdiyev Ali',
        amount: 325,
        orderDate: '16/05/25, 13:45',
        deliveryDate: '16/05/25, 13:45',
    }));

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
                                <th>Sifariş ID</th>
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
                                    <td>№{order.id}</td>
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
                                <button onClick={() => navigate(`/orders/${order.id}`)}>Ətraflı bax</button>
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

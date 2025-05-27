import React, { useState } from 'react';
import './index.scss';

const OrderHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const orders = [
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təsdiq gözləyən',
        },
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
        },
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Təsdiq gözləyən',
        },
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
        },
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmamış',
        },
        {
            id: 'NP764543702735',
            product: 'Kartoşka, subun, səftəli, qab yuyan...',
            quantity: '5 kateqoriya, 36 ədəd məhsul',
            status: 'Tamamlanmış',
        }
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'pending' && order.status === 'Təsdiq gözləyən') ||
            (filter === 'completed' && order.status === 'Tamamlanmış') ||
            (filter === 'not-completed' && order.status === 'Tamamlanmamış');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="order-history">
            <h2>Tarixçə</h2>
            <p>Aşağıdan müşahidə seçərək yeni sifarişlərinizi təxminə bilərsiniz</p>
            <div className="order-history__controls">
                <input
                    type="text"
                    placeholder="Axtarış edin"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Hamısı</option>
                    <option value="pending">Təsdiq gözləyən</option>
                    <option value="completed">Tamamlanmış</option>
                    <option value="not-completed">Tamamlanmamış</option>
                </select>
            </div>
            <div className="order-history__list">
                {filteredOrders.map((order, index) => (
                    <div key={index} className="order-history__item">
                        <div className="order-history__details">
                            <p className="order-history__id"><span>Order ID</span> {order.id}</p>
                            <span
                                className={`order-history__status ${
                                    order.status === 'Tamamlanmış' ? 'completed' :
                                        order.status === 'Təsdiq gözləyən' ? 'pending' : 'not-completed'
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="order-history__data">
                            <p>{order.product}</p>
                            <p>{order.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
import './index.scss';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetOrdersQuery} from "../../../services/adminApi.jsx";

const ActiveOrders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 9;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const {data: getOrders, refetch} = useGetOrdersQuery()
    const orderss = getOrders?.data
    const orders = orderss
        ?.filter(order => {
            const {employeeConfirm, fighterConfirm, employeeDelivery} = order;
            const bothConfirmed = employeeConfirm && fighterConfirm;
            const allTrue = employeeConfirm && fighterConfirm && employeeDelivery;
            return !(bothConfirmed || allTrue); // true olanları çıxarırıq
        })
        .map(order => {
            const amount = order.items.reduce((sum, item) => {
                return sum + item.price;
            }, 0);

            return {
                id: order.id,
                company: order.section?.companyName || '—',
                person: `${order.adminInfo?.name || ''} ${order.adminInfo?.surname || ''}`,
                amount: `${order.section?.companyName || ''}`,
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
                                <th>Sifarişi verən şirkət</th>
                                <th>Sifarişi verən şəxs</th>

                                <th>Sifariş tarixi</th>
                                <th>Çatdırılacaq tarix</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedOrders.map((order, idx) => (
                                <tr key={order.id}>
                                    <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td>{order.amount}</td>
                                    <td>{order.person}</td>
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
                                <button onClick={() => navigate(`/supplier/activeOrder/${order.id}`)}>
                                    {isMobile ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M1.66675 10.0013C3.00008 6.58714 6.11341 4.16797 10.0001 4.16797C13.8867 4.16797 17.0001 6.58714 18.3334 10.0013C17.0001 13.4155 13.8867 15.8346 10.0001 15.8346C6.11341 15.8346 3.00008 13.4155 1.66675 10.0013Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg> : 'Ətraflı bax'}
                                </button>
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

import './index.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaTimes} from "react-icons/fa";

const SupplierVendors = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 5;
    const [searchName, setSearchName] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
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
        <div className="supplier-vendors-main">
            <div className="supplier-vendors">
                <h2>Vendorlar</h2>
                <p>Mövcud vendor məlumatlarını bu bölmədən nəzərdən keçirə bilərsiniz</p>

                <div className="order-table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    {activeSearch === 'name' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes
                                                onClick={() => {
                                                    setActiveSearch(null);
                                                    setSearchName('');
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Vendor Adı
                                            <svg onClick={() => setActiveSearch('name')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="..." fill="#7A7A7A" />
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Ümumi xərc</th>
                                <th>Sifarişlərə bax</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedOrders.map((order, idx) => (
                                <tr key={order.id}>
                                    <td>№{order.id}</td>
                                    <td>{order.company}</td>
                                    <td>
                                        <button onClick={()=>navigate("/supplier/vendor/:id")}>Ətraflı</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>


                </div>

                <div className="supplier-vendors__pagination">
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

export default SupplierVendors;

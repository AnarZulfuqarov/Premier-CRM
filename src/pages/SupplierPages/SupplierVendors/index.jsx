import './index.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaTimes} from "react-icons/fa";
import {useGetAllVendorsQuery} from "../../../services/adminApi.jsx";

const SupplierVendors = () => {
    const navigate = useNavigate();

    const [searchName, setSearchName] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const {data:getAllVendors} = useGetAllVendorsQuery()
    const vendors = getAllVendors?.data
    const filteredVendors = vendors?.filter((vendor) =>
        vendor.name.toLowerCase().includes(searchName.toLowerCase())
    );



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
                            {filteredVendors?.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td>{vendor.name}</td>
                                    <td>{vendor.totalSale} ₼</td>
                                    <td>
                                        <button onClick={() => navigate(`/supplier/vendor/${vendor.id}`)}>
                                            Ətraflı
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>


                </div>

            </div>
        </div>
    );
};

export default SupplierVendors;

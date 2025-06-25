import './index.scss';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTimes } from "react-icons/fa";

const ActiveOrdersDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [modalData, setModalData] = useState({ quantity: '', price: '', vendor: '' });
    const [confirmedRows, setConfirmedRows] = useState({});

    const navigate = useNavigate();
    const pageSize = 9;

    const order = {
        id: 'NP764543702735',
        status: 'Təsdiq gözləyən',
        items: Array.from({ length: 20 }).map(() => ({
            name: 'Kartof',
            category: 'Ərzaq',
            required: '15 ədəd',
            provided: '15 ədəd',
            price: '325 ₼',
            vendor: 'Bravo',
            created: '16/05/25, 13:45',
            delivery: '16/05/25, 13:45',
            received: '16/05/25, 13:45',
        })),
    };

    const filtered = order.items.filter(item => {
        const byName = item.name.toLowerCase().includes(searchName.toLowerCase());
        const byCat = item.category.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="active-order-detail-main">
            <div className="active-order-detail">
                <div className={"headerr"}>
                    <h2>
                        <NavLink className="link" to="/admin/history">— Aktiv sifarişlər</NavLink>{' '}
                        — Sifariş detallları
                    </h2>
                    <button>Sifarişi tamamla</button>
                </div>
                <div className={"about"}>
                    <div className={"about-content"}>
                        <p>Sifariş verən şirkət:<span> Şirvanşah</span></p>
                        <p>Sifariş verən şəxs:<span> Heydərova Səbinə</span></p>
                        <p>Şöbə:<span> Restoran</span></p>
                        <p>Bölmə: <span>Mətbəx</span></p>
                    </div>
                    <button>
                        <span>Çap et</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15.753 3C16.3497 3 16.922 3.23705 17.344 3.65901C17.7659 4.08097 18.003 4.65326 18.003 5.25L18.002 6.003H18.752C19.614 6.00353 20.4405 6.34605 21.0502 6.95537C21.6599 7.56469 22.0029 8.39103 22.004 9.253L22.007 15.25C22.007 15.8464 21.7702 16.4184 21.3487 16.8403C20.9272 17.2622 20.3554 17.4995 19.759 17.5H18V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.7629 16.3467 21 15.75 21H8.25C7.65326 21 7.08097 20.7629 6.65901 20.341C6.23705 19.919 6 19.3467 6 18.75V17.5H4.25C3.65326 17.5 3.08097 17.2629 2.65901 16.841C2.23705 16.419 2 15.8467 2 15.25V9.254C2 8.39205 2.34241 7.5654 2.9519 6.9559C3.5614 6.34641 4.38805 6.004 5.25 6.004L5.999 6.003L6 5.25C6 4.65326 6.23705 4.08097 6.65901 3.65901C7.08097 3.23705 7.65326 3 8.25 3H15.753ZM15.75 13.5H8.25C8.05109 13.5 7.86032 13.579 7.71967 13.7197C7.57902 13.8603 7.5 14.0511 7.5 14.25V18.75C7.5 19.164 7.836 19.5 8.25 19.5H15.75C15.9489 19.5 16.1397 19.421 16.2803 19.2803C16.421 19.1397 16.5 18.9489 16.5 18.75V14.25C16.5 14.0511 16.421 13.8603 16.2803 13.7197C16.1397 13.579 15.9489 13.5 15.75 13.5ZM18.752 7.504H5.25C4.78587 7.504 4.34075 7.68837 4.01256 8.01656C3.68437 8.34475 3.5 8.78987 3.5 9.254V15.25C3.5 15.664 3.836 16 4.25 16H6V14.25C6 13.6533 6.23705 13.081 6.65901 12.659C7.08097 12.2371 7.65326 12 8.25 12H15.75C16.3467 12 16.919 12.2371 17.341 12.659C17.7629 13.081 18 13.6533 18 14.25V16H19.783C19.9772 15.9933 20.1612 15.9114 20.2963 15.7717C20.4313 15.632 20.5069 15.4453 20.507 15.251L20.504 9.254C20.5029 8.78985 20.318 8.34504 19.9896 8.01702C19.6612 7.68901 19.2162 7.50453 18.752 7.504ZM15.752 4.5H8.25C8.05109 4.5 7.86032 4.57902 7.71967 4.71967C7.57902 4.86032 7.5 5.05109 7.5 5.25L7.499 6.003H16.502V5.25C16.502 5.05109 16.423 4.86032 16.2823 4.71967C16.1417 4.57902 15.9509 4.5 15.752 4.5Z" fill="#434343"/>
                        </svg>
                    </button>
                </div>
                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="order-history-detail-supplier__table">
                            <thead>
                            <tr>
                                <th></th>
                                <th>
                                    {activeSearch === 'name' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchName}
                                                onChange={e => setSearchName(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveSearch(null);
                                                setSearchName('');
                                            }} />
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Məhsulun adı
                                            <svg onClick={() => setActiveSearch('name')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="..." fill="#7A7A7A" />
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Tələb olunan miqdar</th>
                                <th>Təmin olunan miqdar</th>
                                <th>Vendor</th>
                                <th>Sifarişin məbləği</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pagedItems.map((item, i) => {
                                const absoluteIndex = (currentPage - 1) * pageSize + i;
                                return (
                                    <tr key={i} onClick={() => {
                                        setSelectedRowIndex(absoluteIndex);
                                        setModalData({ quantity: '', price: '', vendor: '' });
                                    }}>
                                        <td> <input
                                            type="checkbox"
                                            checked={!!confirmedRows[absoluteIndex]}
                                            readOnly
                                        /></td>
                                        <td>

                                            {item.name}
                                        </td>
                                        <td>{item.required}</td>
                                        <td>{confirmedRows[absoluteIndex]?.quantity || '-'}</td>
                                        <td>{confirmedRows[absoluteIndex]?.vendor || '-'}</td>
                                        <td>{confirmedRows[absoluteIndex]?.price || '-'}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-footer">
                        <span>Ümumi məbləğ:</span>
                        <span>2450 ₼</span>
                    </div>
                </div>

                {selectedRowIndex !== null && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Məhsul detallları</h3>
                            <div className="modal-fields">
                                <input
                                    placeholder="Təmin olunan miqdar"
                                    value={modalData.quantity}
                                    onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })}
                                />
                                <input
                                    placeholder="Qiymət daxil et"
                                    value={modalData.price}
                                    onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                                />
                                <select
                                    value={modalData.vendor}
                                    onChange={(e) => setModalData({ ...modalData, vendor: e.target.value })}
                                >
                                    <option value="">Vendor seç</option>
                                    <option value="Bravo">Bravo</option>
                                    <option value="Araz">Araz</option>
                                </select>
                            </div>
                            <button onClick={() => {
                                if (modalData.quantity && modalData.price && modalData.vendor) {
                                    setConfirmedRows(prev => ({
                                        ...prev,
                                        [selectedRowIndex]: {
                                            quantity: modalData.quantity + ' ədəd',
                                            price: modalData.price + ' ₼',
                                            vendor: modalData.vendor
                                        }
                                    }));
                                    setSelectedRowIndex(null);
                                }
                            }}>Sifarişi təsdiqlə</button>
                        </div>
                    </div>
                )}
                <div className={"invoys"}>
                    <div className={"text"}>
                        <h3>İnvoys faylını daxil edin</h3>
                        <p>PDF və ya digər uyğun formatda invoys sənədini əlavə edin</p>
                    </div>
                    <button><span>İnvoysi yükləyin</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 17H15M12 6V13M12 13L15.5 9.5M12 13L8.5 9.5M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg></button>
                </div>
                <div className="active-order-detail__pagination">
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

export default ActiveOrdersDetail;

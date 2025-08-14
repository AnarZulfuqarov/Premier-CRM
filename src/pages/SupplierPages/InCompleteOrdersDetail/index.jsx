import './index.scss';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useGetAllVendorsQuery, useGetMyOrdersIdQuery, useOrderComplateMutation } from '../../../services/adminApi.jsx';
import { usePopup } from '../../../components/Popup/PopupContext.jsx';

const InCompleteOrdersDetail = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [modalData, setModalData] = useState({ quantity: '', price: '', vendor: '' });
    const [confirmedRows, setConfirmedRows] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [existingInvoices, setExistingInvoices] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedPreview, setSelectedPreview] = useState(null);
    const printRef = useRef(null);
    const { data: getAllVendors } = useGetAllVendorsQuery();
    const vendors = getAllVendors?.data;
    const navigate = useNavigate();
    const pageSize = 9;
    const { data: getMyOrdersId, refetch: myOrdersRefetch } = useGetMyOrdersIdQuery(id);
    const orderData = getMyOrdersId?.data;
    const [complateOrder, { isLoading }] = useOrderComplateMutation();
    const showPopup  = usePopup();

    // Initialize confirmed rows and existing invoices
    useEffect(() => {
        if (orderData?.items?.length) {
            const filled = {};
            orderData.items.forEach((item, index) => {
                if (item.suppliedQuantity > 0) {
                    filled[index] = {
                        quantity: `${item.suppliedQuantity} ${item.product?.measure || ''}`,
                        price: `${item.price} ₼`,
                        vendor: item.vendorName || '—'
                    };
                }
            });
            setConfirmedRows(filled);
            setExistingInvoices(orderData?.overheadNames || []);
        }
    }, [orderData]);

    const filtered = orderData?.items?.map((item) => ({
        name: item.product?.name || '—',
        category: item.product?.categoryName || '—',
        required: `${item.requiredQuantity} ${item.product?.measure || ''}`,
        productId: item.product?.id,
        itemId: item.id,
        measure: item.product?.measure || ''
    }))?.filter(item => {
        const byName = item.name.toLowerCase().includes(searchName.toLowerCase());
        const byCat = item.category.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCat;
    }) || [];

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    const totalAmount = Object.values(confirmedRows).reduce((sum, row) => {
        const numeric = parseFloat(row.price?.replace(' ₼', '') || '0');
        return sum + numeric;
    }, 0);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
            file,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : file.type === 'application/pdf' ? URL.createObjectURL(file) : null,
            type: file.type
        }));
        setUploadedFiles(prev => [...prev, ...newPreviews]);
        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleRemoveExistingInvoice = (index) => {
        setExistingInvoices(prev => prev.filter((_, idx) => idx !== index));
    };

    const handlePrint = () => {
        const printContents = printRef.current;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`<h1>Sifariş № ${orderData?.id}</h1>`);
        printWindow.document.write(`
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const handleSubmitOrder = async () => {
        if (!Object.keys(confirmedRows).length) {
            showPopup("Əməliyyat mümkün olmadı", "Davam etmək üçün ən azı 1 məhsulu tamamlamalısınız.", "warning");
            return;
        }

        if (uploadedFiles.length === 0) {
            showPopup("Əməliyyat mümkün olmadı", "Davam etmək üçün ən azı 1 invoys faylı əlavə etməlisiniz.", "warning");
            return;
        }

        const itemsArray = Object.entries(confirmedRows).map(([index, row]) => {
            const originalItem = filtered[parseInt(index)];
            const vendor = vendors?.find(v => v.name === row.vendor);
            return {
                orderItemId: originalItem.itemId,
                price: parseFloat(row.price.replace(' ₼', '')),
                suppliedQuantity: parseFloat(row.quantity),
                vendorId: vendor?.id || ''
            };
        });

        const formData = new FormData();
        formData.append("orderId", id);
        uploadedFiles.forEach(f => formData.append("orderOverhead", f.file));
        formData.append("orderItemsJson", JSON.stringify(itemsArray));

        try {
            await complateOrder(formData).unwrap();
            showPopup("Uğurlu əməliyyat", "Sifariş sistemə uğurla daxil edildi.", "success");
            navigate("/supplier/activeOrder");
            myOrdersRefetch();
        } catch (err) {
            if (err.status === 400 && err.data?.error?.includes("The OrderOverhead field is required.")) {
                showPopup("Əməliyyat mümkün olmadı", "Davam etmək üçün ən azı 1 invoys faylı əlavə etməlisiniz.", "warning");
            } else {
                showPopup("Sistem xətası", "Əməliyyat tamamlanmadı. Təkrar cəhd edin və ya dəstəyə müraciət edin.", "error");
            }
        }
    };

    const isMobile = window.innerWidth <= 768;

    return (
        <div className="in-complete-order-detail-main">
            <div className="in-complete-order-detail">
                <div className="headerr">
                    <h2>
                        <NavLink className="link" to="/supplier/activeOrder">— Aktiv sifarişlər</NavLink>{' '}
                        — Sifariş detalları
                    </h2>
                    {!isMobile && (
                        <button
                            onClick={handleSubmitOrder}
                            disabled={isLoading}
                            style={{
                                background: isLoading ? '#7b7b7b' : '#384871',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Yüklənir...' : 'Sifarişi tamamla/yenilə'}
                        </button>
                    )}
                </div>
                <div className="about">
                    <div className="about-content">
                        <p>Sifariş verən şirkət: <span>{orderData?.section?.companyName || '—'}</span></p>
                        <p>Sifariş verən şəxs: <span>{orderData?.adminInfo?.surname} {orderData?.adminInfo?.name}</span></p>
                        <p>Şöbə: <span>{orderData?.section?.departmentName || '—'}</span></p>
                        <p>Bölmə: <span>{orderData?.section?.name || '—'}</span></p>
                    </div>
                    {isMobile ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '10px' }}>
                            <button
                                className="complateBtn"
                                onClick={handleSubmitOrder}
                                disabled={isLoading}
                                style={{
                                    background: isLoading ? '#7b7b7b' : '#384871',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Yüklənir...' : 'Sifarişi tamamla/yenilə'}
                            </button>
                            <button className="printBtn" onClick={handlePrint}>
                                <span>Çap et</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M15.753 3C16.3497 3 16.922 3.23705 17.344 3.65901C17.7659 4.08097 18.003 4.65326 18.003 5.25L18.002 6.003H18.752C19.614 6.00353 20.4405 6.34605 21.0502 6.95537C21.6599 7.56469 22.0029 8.39103 22.004 9.253L22.007 15.25C22.007 15.8464 21.7702 16.4184 21.3487 16.8403C20.9272 17.2622 20.3554 17.4995 19.759 17.5H18V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.7629 16.3467 21 15.75 21H8.25C7.65326 21 7.08097 20.7629 6.65901 20.341C6.23705 19.919 6 19.3467 6 18.75V17.5H4.25C3.65326 17.5 3.08097 17.2629 2.65901 16.841C2.23705 16.419 2 15.8467 2 15.25V9.254C2 8.39205 2.34241 7.5654 2.9519 6.9559C3.5614 6.34641 4.38805 6.004 5.25 6.004L5.999 6.003L6 5.25C6 4.65326 6.23705 4.08097 6.65901 3.65901C7.08097 3.23705 7.65326 3 8.25 3H15.753ZM15.75 13.5H8.25C8.05109 13.5 7.86032 13.579 7.71967 13.7197C7.57902 13.8603 7.5 14.0511 7.5 14.25V18.75C7.5 19.164 7.836 19.5 8.25 19.5H15.75C15.9489 19.5 16.1397 19.421 16.2803 19.2803C16.421 19.1397 16.5 18.9489 16.5 18.75V14.25C16.5 14.0511 16.421 13.8603 16.2803 13.7197C16.1397 13.579 15.9489 13.5 15.75 13.5ZM18.752 7.504H5.25C4.78587 7.504 4.34075 7.68837 4.01256 8.01656C3.68437 8.34475 3.5 8.78987 3.5 9.254V15.25C3.5 15.664 3.836 16 4.25 16H6V14.25C6 13.6533 6.23705 13.081 6.65901 12.659C7.08097 12.2371 7.65326 12 8.25 12H15.75C16.3467 12 16.919 12.2371 17.341 12.659C17.7629 13.081 18 13.6533 18 14.25V16H19.783C19.9772 15.9933 20.1612 15.9114 20.2963 15.7717C20.4313 15.632 20.5069 15.4453 20.507 15.251L20.504 9.254C20.5029 8.78985 20.318 8.34504 19.9896 8.01702C19.6612 7.68901 19.2162 7.50453 18.752 7.504ZM15.752 4.5H8.25C8.05109 4.5 7.86032 4.57902 7.71967 4.71967C7.57902 4.86032 7.5 5.05109 7.5 5.25L7.499 6.003H16.502V5.25C16.502 5.05109 16.423 4.86032 16.2823 4.71967C16.1417 4.57902 15.9509 4.5 15.752 4.5Z"
                                        fill="#434343"/>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button className="printBtn" onClick={handlePrint}>
                            <span>Çap et</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M15.753 3C16.3497 3 16.922 3.23705 17.344 3.65901C17.7659 4.08097 18.003 4.65326 18.003 5.25L18.002 6.003H18.752C19.614 6.00353 20.4405 6.34605 21.0502 6.95537C21.6599 7.56469 22.0029 8.39103 22.004 9.253L22.007 15.25C22.007 15.8464 21.7702 16.4184 21.3487 16.8403C20.9272 17.2622 20.3554 17.4995 19.759 17.5H18V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.7629 16.3467 21 15.75 21H8.25C7.65326 21 7.08097 20.7629 6.65901 20.341C6.23705 19.919 6 19.3467 6 18.75V17.5H4.25C3.65326 17.5 3.08097 17.2629 2.65901 16.841C2.23705 16.419 2 15.8467 2 15.25V9.254C2 8.39205 2.34241 7.5654 2.9519 6.9559C3.5614 6.34641 4.38805 6.004 5.25 6.004L5.999 6.003L6 5.25C6 4.65326 6.23705 4.08097 6.65901 3.65901C7.08097 3.23705 7.65326 3 8.25 3H15.753ZM15.75 13.5H8.25C8.05109 13.5 7.86032 13.579 7.71967 13.7197C7.57902 13.8603 7.5 14.0511 7.5 14.25V18.75C7.5 19.164 7.836 19.5 8.25 19.5H15.75C15.9489 19.5 16.1397 19.421 16.2803 19.2803C16.421 19.1397 16.5 18.9489 16.5 18.75V14.25C16.5 14.0511 16.421 13.8603 16.2803 13.7197C16.1397 13.579 15.9489 13.5 15.75 13.5ZM18.752 7.504H5.25C4.78587 7.504 4.34075 7.68837 4.01256 8.01656C3.68437 8.34475 3.5 8.78987 3.5 9.254V15.25C3.5 15.664 3.836 16 4.25 16H6V14.25C6 13.6533 6.23705 13.081 6.65901 12.659C7.08097 12.2371 7.65326 12 8.25 12H15.75C16.3467 12 16.919 12.2371 17.341 12.659C17.7629 13.081 18 13.6533 18 14.25V16H19.783C19.9772 15.9933 20.1612 15.9114 20.2963 15.7717C20.4313 15.632 20.5069 15.4453 20.507 15.251L20.504 9.254C20.5029 8.78985 20.318 8.34504 19.9896 8.01702C19.6612 7.68901 19.2162 7.50453 18.752 7.504ZM15.752 4.5H8.25C8.05109 4.5 7.86032 4.57902 7.71967 4.71967C7.57902 4.86032 7.5 5.05109 7.5 5.25L7.499 6.003H16.502V5.25C16.502 5.05109 16.423 4.86032 16.2823 4.71967C16.1417 4.57902 15.9509 4.5 15.752 4.5Z"
                                    fill="#434343"/>
                            </svg>
                        </button>
                    )}
                </div>
                <div style={{ display: 'none' }}>
                    <div ref={printRef}>
                        <h2>Sifariş Detalları</h2>
                        <p><strong>Şirkət:</strong> {orderData?.section?.companyName}</p>
                        <p><strong>Şöbə:</strong> {orderData?.section?.departmentName}</p>
                        <p><strong>Bölmə:</strong> {orderData?.section?.name}</p>
                        <p><strong>Sifarişçi:</strong> {orderData?.adminInfo?.surname} {orderData?.adminInfo?.name}</p>
                        <table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Məhsul</th>
                                <th>Tələb olunan miqdar</th>
                                <th>Təmin olunan miqdar</th>
                                <th>Vendor</th>
                                <th>Qiymət</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((item, index) => {
                                const data = confirmedRows[index] || {};
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.required}</td>
                                        <td>{data.quantity || '-'}</td>
                                        <td>{data.vendor || '-'}</td>
                                        <td>{data.price || '-'}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                            Ümumi məbləğ: {totalAmount} ₼
                        </div>
                    </div>
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
                                const isCompleted = !!confirmedRows[absoluteIndex]; // Check if row is completed

                                return (
                                    <tr
                                        key={i}
                                        className={isCompleted ? 'disabled-row' : ''} // Apply disabled class
                                        onClick={() => {
                                            if (!isCompleted) {
                                                // Only allow clicking if the row is not completed
                                                const data = confirmedRows[absoluteIndex];
                                                setSelectedRowIndex(absoluteIndex);
                                                setModalData({
                                                    quantity: data?.quantity?.replace(` ${item.measure}`, '') || '',
                                                    price: data?.price?.replace(' ₼', '') || '',
                                                    vendor: data?.vendor || '',
                                                });
                                            }
                                        }}
                                        style={isCompleted ? { cursor: 'not-allowed' } : {}} // Optional inline style for cursor
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={isCompleted}
                                                readOnly
                                                disabled={isCompleted} // Disable checkbox for completed rows
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.required}</td>
                                        <td>{confirmedRows[absoluteIndex]?.quantity || '-'}</td>
                                        <td>{confirmedRows[absoluteIndex]?.vendor || '-'}</td>
                                        <td>{confirmedRows[absoluteIndex]?.price || '-'}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div className="table-footer">
                            <span>Ümumi məbləğ:</span>
                            <span>{totalAmount} ₼</span>
                        </div>
                    </div>
                </div>
                {selectedRowIndex !== null && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Məhsul detalları</h3>
                            <div className="closeIcon" onClick={() => setSelectedRowIndex(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M12.6667 3.3335L3.33337 12.6668M3.33337 3.3335L12.6667 12.6668" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="modal-fields">
                                <input
                                    placeholder={`Təmin olunan miqdar (${filtered[selectedRowIndex]?.measure || ''})`}
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
                                    {vendors?.map((vendor) => (
                                        <option key={vendor.id} value={vendor.name}>
                                            {vendor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    if (modalData.quantity && modalData.price && modalData.vendor) {
                                        const currentMeasure = filtered[selectedRowIndex]?.measure || '';
                                        setConfirmedRows(prev => ({
                                            ...prev,
                                            [selectedRowIndex]: {
                                                quantity: `${modalData.quantity} ${currentMeasure}`,
                                                price: `${modalData.price} ₼`,
                                                vendor: modalData.vendor
                                            }
                                        }));
                                        setSelectedRowIndex(null);
                                    }
                                }}
                            >
                                Sifarişi təsdiqlə/yenilə
                            </button>
                        </div>
                    </div>
                )}
                <div className="invoys">
                    <div className="text">
                        <h3>İnvoys faylını daxil edin</h3>
                        <p>PDF və ya digər uyğun formatda invoys sənədini əlavə edin</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <input
                            type="file"
                            id="invoice-upload"
                            style={{ display: 'none' }}
                            accept=".pdf,image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <label className="upload-button" htmlFor="invoice-upload">
                            <span>İnvoysi yükləyin</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M9 17H15M12 6V13M12 13L15.5 9.5M12 13L8.5 9.5M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
                                    stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                                />
                            </svg>
                        </label>
                        {(uploadedFiles.length > 0 || existingInvoices.length > 0) && (
                            <button
                                className="upload-button"
                                onClick={() => setShowPreviewModal(true)}
                                style={{ marginLeft: '20px' }}
                            >
                                {uploadedFiles.length + existingInvoices.length}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z"
                                        stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                                    />
                                    <path
                                        d="M1.66667 10.0003C3 6.58616 6.11333 4.16699 10 4.16699C13.8867 4.16699 17 6.58616 18.3333 10.0003C17 13.4145 13.8867 15.8337 10 15.8337C6.11333 15.8337 3 13.4145 1.66667 10.0003Z"
                                        stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="in-complete-order-detail__pagination">
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
            {showPreviewModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{ width: '600px' }}>
                        <h3>Yüklənmiş sənədlər</h3>
                        <div className="image-preview-grid">
                            {existingInvoices.map((url, index) => (
                                <div key={`existing-${index}`} className="image-thumb">
                                    {url.endsWith('.pdf') ? (
                                        <div
                                            onClick={() => window.open(url, '_blank')}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📄 Mövcud PDF #{index + 1}
                                        </div>
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`existing-preview-${index}`}
                                            onClick={() => setSelectedPreview({ url, type: 'image' })}
                                        />
                                    )}
                                    <div className="image-thumb-footer">
                                        <span>Mövcud #{index + 1}</span>
                                        <button className="remove-btn" onClick={() => handleRemoveExistingInvoice(index)}>❌</button>
                                    </div>
                                </div>
                            ))}
                            {uploadedFiles.map((file, index) => (
                                <div key={file.key} className="image-thumb">
                                    {file.type === 'application/pdf' ? (
                                        <div
                                            onClick={() => window.open(file.previewUrl, '_blank')}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📄 Yeni PDF #{index + 1}
                                        </div>
                                    ) : (
                                        <img
                                            src={file.previewUrl}
                                            alt={`preview-${index}`}
                                            onClick={() => setSelectedPreview({ url: file.previewUrl, type: 'image' })}
                                        />
                                    )}
                                    <div className="image-thumb-footer">
                                        <span>Yeni #{index + 1}</span>
                                        <button className="remove-btn" onClick={() => handleRemoveImage(index)}>❌</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowPreviewModal(false)}>Bağla</button>
                    </div>
                </div>
            )}
            {selectedPreview && (
                <div className="modal-overlay" onClick={() => setSelectedPreview(null)}>
                    <div className="modal-box" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                        {selectedPreview.type === 'pdf' ? (
                            <iframe
                                src={selectedPreview.url}
                                title="PDF Preview"
                                width="100%"
                                height="90%"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <img
                                src={selectedPreview.url}
                                alt="Böyük şəkil"
                                style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', margin: '0 auto' }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InCompleteOrdersDetail;
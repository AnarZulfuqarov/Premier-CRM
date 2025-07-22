// OrderHistoryDetail.jsx
import  {useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import { FaTimes} from 'react-icons/fa';
import './index.scss';
import {useGetAllVendorsIdQuery, useGetMyOrdersIdQuery} from "../../../services/adminApi.jsx";

const VendorHistoryDetailSuplier = () => {
    const { vendorId, id } = useParams()
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [activeSearch, setActiveSearch] = useState(null);

    const { data: getAllVendorsId } = useGetAllVendorsIdQuery(vendorId);
    const vendor = getAllVendorsId?.data;

    const { data: getMyOrdersId } = useGetMyOrdersIdQuery(id);
    const orderData = getMyOrdersId?.data;

    if (
        !orderData?.employeeConfirm ||
        !orderData?.fighterConfirm ||
        (orderData?.employeeConfirm && !orderData?.fighterConfirm && !orderData?.employeeDelivery)
    ) {
        return null; // Maplama! görünməyəcək
    }
    const itemCount = orderData?.items?.length || 0;

    const uniqueCategories = [
        ...new Set(orderData?.items?.map(item => item.product?.categoryName).filter(Boolean))
    ];
    const categoryCount = uniqueCategories.length;

    const status =
        orderData.employeeConfirm && orderData.fighterConfirm && !orderData.employeeDelivery
            ? 'Sifarişçidən təhvil gözləyən'
            : orderData.employeeConfirm && orderData.fighterConfirm && orderData.employeeDelivery
                ? 'Tamamlanmış'
                : 'Təsdiq gözləyən';

    const filteredItems = orderData.items.filter((item) => {
        const byName = item.product.name.toLowerCase().includes(searchName.toLowerCase());
        const byCategory = item.product.categoryName.toLowerCase().includes(searchCategory.toLowerCase());
        return byName && byCategory;
    });

    const totalPrice = orderData.items?.reduce((sum, item) =>
        sum + item.suppliedQuantity * (item?.price || 0), 0
    ) || 0;
    const isMobile = window.innerWidth <= 768;
    return (
        <div className="vendor-history-detail-supplier-main">
            <div className="vendor-history-detail-supplier">
                <h2>
                    <NavLink className="link" to="/supplier/products/vendors">— Vendorlar</NavLink>{' '}
                    <NavLink to={`/supplier/vendor/${vendorId}`} className={"link"} >— {vendor?.name}</NavLink>
                    — {status}
                </h2>
                <div key={orderData.id} className="vendor-history-detail-supplier_item">
                    <div className="techizat">
                        <div className="order-history-supplier__ids">
                            <p className="order-history-supplier__id">
                                <span>Təchizatçının adı:</span> {orderData.fighterInfo.name} {orderData.fighterInfo.surname}
                            </p>
                            <p className="order-history-supplier__id">
                                <span>Sifarişçinin adı:</span> {orderData.adminInfo.name} {orderData.adminInfo.surname}
                            </p>
                        </div>
                    </div>

                    <div className="order-history-supplier__details">
                        <div className="order-history-supplier__ids">
                            <p className="order-history-supplier__id">
                                <span>Order ID:</span> {orderData.id}
                            </p>
                            <p className="order-history-supplier__id">
                                <span>Ümumi məbləğ:</span> {totalPrice.toFixed(2)} ₼
                            </p>
                        </div>
                        {isMobile ? ("") : (<div
                            className={`order-history-supplier__status ${
                                status === 'Tamamlanmış'
                                    ? 'completed'
                                    : status === 'Sifarişçidən təhvil gözləyən'
                                        ? 'pending'
                                        : 'not-completed'
                            }`}
                        >
                            {status}
                        </div>)}
                    </div>

                    <div className="order-history-supplier__data">
                        <p>{orderData?.items?.map((item) => item.product?.name).join(', ')}</p>
                        <p>
                            <span className="quantity-count">{itemCount}</span>{' '}
                            <span className="quantity-label">məhsul,</span>{' '}
                            <span className="quantity-count">{categoryCount}</span>{' '}
                            <span className="quantity-label">kateqoriya</span>
                        </p>
                    </div>
                    {isMobile ? (<div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:"end",
                        marginTop:"10px"
                    }}>
                        <div
                            className={`order-history-supplier__status ${
                                status === 'Tamamlanmış'
                                    ? 'completed'
                                    : status === 'Sifarişçidən təhvil gözləyən'
                                        ? 'pending'
                                        : 'not-completed'
                            }`}
                        >
                            {status}
                        </div>
                    </div>) : ("")}
                </div>

                <div className="table-wrapper">
                    <div className="table-scroll">
                        <table className="vendor-history-detail-supplier__table">
                            <thead>
                            <tr>
                                <th>№</th>
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
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Məhsulun adı
                                            <svg onClick={() => setActiveSearch('name')}
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>
                                    {activeSearch === 'category' ? (
                                        <div className="th-search">
                                            <input
                                                autoFocus
                                                value={searchCategory}
                                                onChange={e => setSearchCategory(e.target.value)}
                                                placeholder="Axtar..."
                                            />
                                            <FaTimes onClick={() => {
                                                setActiveSearch(null);
                                                setSearchCategory('');
                                            }}/>
                                        </div>
                                    ) : (
                                        <div className="th-label">
                                            Kateqoriyası
                                            <svg onClick={() => setActiveSearch('category')}
                                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20.71 19.29L17.31 15.9C18.407 14.5025 19.0022 12.7767 19 11C19 9.41775 18.5308 7.87103 17.6518 6.55544C16.7727 5.23985 15.5233 4.21447 14.0615 3.60897C12.5997 3.00347 10.9911 2.84504 9.43928 3.15372C7.88743 3.4624 6.46197 4.22433 5.34315 5.34315C4.22433 6.46197 3.4624 7.88743 3.15372 9.43928C2.84504 10.9911 3.00347 12.5997 3.60897 14.0615C4.21447 15.5233 5.23985 16.7727 6.55544 17.6518C7.87103 18.5308 9.41775 19 11 19C12.7767 19.0022 14.5025 18.407 15.9 17.31L19.29 20.71C19.383 20.8037 19.4936 20.8781 19.6154 20.9289C19.7373 20.9797 19.868 21.0058 20 21.0058C20.132 21.0058 20.2627 20.9797 20.3846 20.9289C20.5064 20.8781 20.617 20.8037 20.71 20.71C20.8037 20.617 20.8781 20.5064 20.9289 20.3846C20.9797 20.2627 21.0058 20.132 21.0058 20C21.0058 19.868 20.9797 19.7373 20.9289 19.6154C20.8781 19.4936 20.8037 19.383 20.71 19.29ZM5 11C5 9.81332 5.3519 8.65328 6.01119 7.66658C6.67047 6.67989 7.60755 5.91085 8.7039 5.45673C9.80026 5.0026 11.0067 4.88378 12.1705 5.11529C13.3344 5.3468 14.4035 5.91825 15.2426 6.75736C16.0818 7.59648 16.6532 8.66558 16.8847 9.82946C17.1162 10.9933 16.9974 12.1997 16.5433 13.2961C16.0892 14.3925 15.3201 15.3295 14.3334 15.9888C13.3467 16.6481 12.1867 17 11 17C9.4087 17 7.88258 16.3679 6.75736 15.2426C5.63214 14.1174 5 12.5913 5 11Z"
                                                    fill="#7A7A7A"/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                                <th>Tələb olunan miqdar</th>
                                <th>Təmin olunan miqdar</th>
                                <th>Sifarişin məbləği</th>
                                <th>Sifarişin yaradılma tarixi</th>
                                <th>Çatdırılacaq tarixi</th>
                                <th>Təhvil alınma tarixi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItems.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.categoryName}</td>
                                    <td>{item.requiredQuantity} {item.product.measure}</td>
                                    <td>{item.suppliedQuantity} {item.product.measure}</td>
                                    <td>{item.suppliedQuantity*item.price} ₼</td>
                                    <td>{orderData.createdDate}</td>
                                    <td>{item.orderItemDeliveryTime}</td>
                                    <td>{orderData.employeeDelivery ? orderData.orderDeliveryTime : '-'}</td>
                                </tr>
                            ))}
                            </tbody>

                        </table>
                        <div className="table-footer sticky-footer">
                            <span>Ümumi məbləğ:</span>
                            <span>{totalPrice.toFixed(2)} ₼</span>
                        </div>
                    </div>


                </div>

            </div>

        </div>
    );
};

export default VendorHistoryDetailSuplier;
